from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ServiceRequest


class ServiceRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceRequest

        fields = [
            "id",
            "name",
            "email",
            "company",
            "service",
            "message",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError(
                "Please enter your full name."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        return value

    def validate_company(self, value):
        return value.strip()

    def validate_service(self, value):
        valid_services = dict(
            ServiceRequest.SERVICE_CHOICES
        ).keys()

        if value not in valid_services:
            raise serializers.ValidationError(
                "Please select a valid service."
            )

        return value

    def validate_message(self, value):
        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                "Please provide more details about your requirement."
            )

        return value


class ServiceRequestCreateView(APIView):

    def post(self, request):

        serializer = ServiceRequestSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                {
                    "success": False,
                    "message": "Please correct the errors below.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request = serializer.save()

        return Response(
            {
                "success": True,
                "message": (
                    "Your service request has been received "
                    "successfully."
                ),
                "request_id": service_request.id,
            },
            status=status.HTTP_201_CREATED,
        )
