from google.cloud import translate_v2 as translate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class TranslateTextView(APIView):
    def post(self, request):
        text = request.data.get("text")
        target_language = request.data.get("target")

        if not text:
            return Response(
                {"error": "Text is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not target_language:
            return Response(
                {"error": "Target language is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            client = translate.Client()

            result = client.translate(
                text,
                target_language=target_language,
                format_="text",
            )

            return Response(
                {
                    "original": text,
                    "translated": result["translatedText"],
                    "language": target_language,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as exc:
            return Response(
                {
                    "error": "Translation service unavailable.",
                    "details": str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
