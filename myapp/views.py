from django.shortcuts import render,redirect

from django.views import View
from .models import Topic

class DrawView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.all()
        context = { "topics":topics }

        return render(request,"myapp/draw.html",context)

    def post(self, request, *args, **kwargs):

        posted  = Topic( comment = request.POST["comment"] )
        posted.save()

        return redirect("myapp:draw")

draw   = DrawView.as_view()