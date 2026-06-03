from bson import ObjectId


def serialize_document(document):
    if not document:
        return None

    result = {}
    for key, value in document.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, list):
            result[key] = [serialize_document(item) if isinstance(item, dict) else item for item in value]
        elif isinstance(value, dict):
            result[key] = serialize_document(value)
        else:
            result[key] = value
    return result
