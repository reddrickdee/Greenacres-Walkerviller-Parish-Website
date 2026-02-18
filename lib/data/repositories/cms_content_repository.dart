import 'package:gw_parish_website/data/models/parish_models.dart';
import 'package:gw_parish_website/data/repositories/content_repository.dart';

/// CMS-ready [IContentRepository] demonstrating how a headless CMS
/// (Sanity.io, Strapi, etc.) would be integrated post-approval.
///
/// ## How to activate
///
/// Use [ContentRepositoryFactory] with backend `'cms'`, or construct directly:
/// ```dart
/// final repo = CmsContentRepository(
///   endpoint: 'https://your-project.api.sanity.io/v1/data/query/production',
///   apiToken: const String.fromEnvironment('CMS_TOKEN'),
/// );
/// ```
///
/// No widget, route, or theme changes are required.
class CmsContentRepository implements IContentRepository {
  const CmsContentRepository({
    required this.endpoint,
    this.apiToken,
  });

  /// Root URL of the headless CMS query endpoint.
  final String endpoint;

  /// Optional bearer token for authenticated endpoints.
  final String? apiToken;

  @override
  Future<ParishContent> loadContent() async {
    // TODO: Replace with actual HTTP call.
    //
    // Example (Sanity GROQ):
    //   final uri = Uri.parse('$endpoint?query=*[_type=="parishContent"][0]');
    //   final headers = <String, String>{
    //     if (apiToken != null) 'Authorization': 'Bearer $apiToken',
    //   };
    //   final response = await http.get(uri, headers: headers);
    //
    //   if (response.statusCode != 200) {
    //     throw ContentFetchException(
    //       'CMS returned ${response.statusCode}',
    //     );
    //   }
    //
    //   final json = jsonDecode(response.body) as Map<String, dynamic>;
    //   final result = json['result'] as Map<String, dynamic>?;
    //   if (result == null) {
    //     throw ContentFetchException('Invalid CMS payload: missing result');
    //   }
    //   return ParishContent.fromJson(result);

    throw UnimplementedError(
      'CmsContentRepository.loadContent() is a stub. '
      'Implement your CMS fetch logic here.',
    );
  }
}

/// Thrown when CMS content fetching fails.
class ContentFetchException implements Exception {
  const ContentFetchException(this.message);
  final String message;

  @override
  String toString() => 'ContentFetchException: $message';
}
