from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ContactSerializer


class ContactView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            # Message structure
            subject = "Ny kundförfrågan"
            message_body = (
                f"Förnamn: {data['first_name']}\n"
                f"Efternamn: {data['last_name']}\n"
                f"E-post: {data['email']}\n"
                f"Telefon: {data.get('phone', 'Ej angivet')}\n\n"
                f"Meddelande:\n{data['message']}"
            )

            try:
                # Send email:
                send_mail(
                    subject,
                    message_body,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                return Response(
                    {"message": "Ditt meddelande har skickats!"}, status=200
                )
            except Exception as e:
                return Response({"error": str(e)}, status=500)
        else:
            return Response(serializer.errors, status=400)
