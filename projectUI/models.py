from django.db import models

class Diary(models.Model):
    user_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=200, blank=True, null=True)
    entire_diary = models.TextField(blank=True, null=True)

class DiarySentence(models.Model):
    user_id = models.CharField(max_length=100, blank=True, null=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='sentences', blank=True, null=True)
    original_sentence = models.TextField()
    corrected_sentence = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(default=False)
    feedback = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True) 