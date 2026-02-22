import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const UNIVERSALIS_URL = "https://universalis.com/australia.adelaide/jsonpmass.js";

async function fetchUniversalisReadings(dateIso?: string) {
    // Determine target URL with specific date if provided (e.g., YYYYMMDD)
    const formattedDate = dateIso ? dateIso.replace(/-/g, '') : '';
    const fetchUrl = formattedDate ? `https://universalis.com/australia.adelaide/${formattedDate}/jsonpmass.js` : UNIVERSALIS_URL;

    console.log(`Fetching from Universalis: ${fetchUrl}`);
    const response = await fetch(fetchUrl);

    if (!response.ok) {
        throw new Error(`Universalis API returned ${response.status}: ${response.statusText}`);
    }

    const payload = await response.text();
    // Payload is JSONP: universalisCallback({ ... })
    // We need to strip the callback wrapper
    const startIndex = payload.indexOf('(') + 1;
    const endIndex = payload.lastIndexOf(')');
    if (startIndex <= 0 || endIndex <= 0) {
        throw new Error("Invalid JSONP payload from Universalis");
    }

    const jsonStr = payload.substring(startIndex, endIndex);
    const data = JSON.parse(jsonStr);

    // Convert YYYYMMDD number into YYYY-MM-DD
    const numberStr = data.number.toString();
    const parsedDateIso = `${numberStr.substring(0, 4)}-${numberStr.substring(4, 6)}-${numberStr.substring(6, 8)}`;

    const titleStr = data.day ? data.day.replace(/<[^>]+>/g, '').trim() : 'Daily Mass';

    return {
        date: parsedDateIso,
        title: titleStr,
        first_reading_html: data.Mass_R1?.text || null,
        psalm_html: data.Mass_Ps?.text || null,
        second_reading_html: data.Mass_R2?.text || null,
        gospel_acclamation_html: data.Mass_GA?.text || null,
        gospel_html: data.Mass_G?.text || null,
    };
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

        if (!supabaseUrl || !supabaseServiceRoleKey) {
            throw new Error("Missing Supabase environment variables.");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        // Parse request to see if a specific date was requested
        let dateToFetch: string | undefined = undefined;
        if (req.method === 'POST') {
            try {
                const body = await req.json();
                if (body.date) {
                    dateToFetch = body.date; // Expecting YYYY-MM-DD
                }
            } catch (e) {
                // Ignore missing body
            }
        }

        const readingsData = await fetchUniversalisReadings(dateToFetch);

        // We fetch existing data to preserve liturgical color, title, reflection, etc.
        const { data: existingData, error: fetchError } = await supabase
            .from('daily_reflections')
            .select('*')
            .eq('date', readingsData.date)
            .maybeSingle();

        if (fetchError) {
            console.error("Error fetching existing reflection:", fetchError);
            throw fetchError;
        }

        const payload = {
            ...(existingData || {}),
            date: readingsData.date,
            first_reading_html: readingsData.first_reading_html,
            psalm_html: readingsData.psalm_html,
            second_reading_html: readingsData.second_reading_html,
            gospel_acclamation_html: readingsData.gospel_acclamation_html,
            gospel_html: readingsData.gospel_html,
            liturgical_color: existingData?.liturgical_color || 'Violet', // Default liturgical color
            title: existingData?.title || readingsData.title,
        };

        const { data: upsertData, error: upsertError } = await supabase
            .from('daily_reflections')
            .upsert(payload, { onConflict: 'date' })
            .select()
            .single();

        if (upsertError) {
            console.error("Error upserting readings:", upsertError);
            throw upsertError;
        }

        return new Response(JSON.stringify({ success: true, data: upsertData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
