from django.shortcuts import render,redirect
from django.http.response import JsonResponse

from django.views import View
from .models import Topic
from .forms import TopicForm
from .models import Index
from .forms import IndexForm

class DrawView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.all()
        context = { "topics":topics }

        return render(request,"myapp/draw.html",context)

    def post(self, request, *args, **kwargs):

        json    = { "error":True }

        form    = TopicForm(request.POST,request.FILES)

        if form.is_valid():
            print("OK")
            json["error"]   = False
            form.save()
        else:
            print("NG")

        return JsonResponse(json)

class DrawVueView(View):

    def get(self, request, *args, **kwargs):

        topics  = Topic.objects.all()
        context = { "topics":topics }

        return render(request,"myapp/drawVue.html",context)

    def post(self, request, *args, **kwargs):

        json    = { "error":True }

        form    = TopicForm(request.POST,request.FILES)

        if form.is_valid():
            print("OK")
            json["error"]   = False
            form.save()
        else:
            print("NG")

        return JsonResponse(json)

class indexView(View):
    def post(self, request, *args, **kwargs):
        form = IndexForm(request.POST, request.FILES)
        if form.is_valid():
            index = form.save()
            return JsonResponse({
                'error': False,
                'image_url': index.image.url,
            })
        else:
            print(form.errors)  # デバッグ用: フォームのエラー情報を表示
            return JsonResponse({'error': True, 'message': 'Invalid save your sketch'})

    def get(self, request, *args, **kwargs):
        return render(request, 'myapp/index.html', {'form': IndexForm()})

drawVue = DrawVueView.as_view()
draw   = DrawView.as_view()
index = indexView.as_view()