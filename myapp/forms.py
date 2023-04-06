from django import forms
from .models import Topic
from .models import Index

class TopicForm(forms.ModelForm):

    class Meta:
        model   = Topic
        fields  = [ "comment","img" ]

class IndexForm(forms.ModelForm):
    class Meta:
        model = Index
        fields = ('image',)