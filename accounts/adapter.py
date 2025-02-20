from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):
    # PRODUCTION
    def get_email_confirmation_url(self, request, emailconfirmation):
        return f"https://juridiq.nu/verify-email/{emailconfirmation.key}"

    # DEVELOPMENT
    # def get_email_confirmation_url(self, request, emailconfirmation):
    #     return f"http://192.168.1.24:5173/verify-email/{emailconfirmation.key}"
