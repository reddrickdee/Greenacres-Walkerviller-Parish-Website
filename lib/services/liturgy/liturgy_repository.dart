import 'package:gw_parish_website/data/models/liturgy_models.dart';

abstract interface class LiturgyRepository {
  Future<LiturgicalDay> getToday({DateTime? now});
}
