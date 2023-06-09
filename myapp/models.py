from django.db import models

class Topic(models.Model):

    class Meta:
        db_table = "topic"

    comment = models.CharField(verbose_name="コメント",max_length=2000)
    img     = models.ImageField(verbose_name="イラスト",upload_to="img/", null=True, default=None)

    def __str__(self):
        return self.comment
    
class Index(models.Model):
    image = models.ImageField(upload_to='img/')
    created_at = models.DateTimeField(auto_now_add=True)