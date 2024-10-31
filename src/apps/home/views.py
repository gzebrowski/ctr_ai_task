from django.views.generic import TemplateView


class VueHomeView(TemplateView):
    template_name = "index_vue.html"


class ReactHomeView(TemplateView):
    template_name = "index_react.html"
