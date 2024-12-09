from celery import Celery

from akismet import Akismet

from django.core.exceptions import ImproperlyConfigured
from django.contrib.sites.models import Site

from torrentapp.models import Comment
from django.core.cache import cache


app = Celery( broker='redis://localhost:6379/0')


import requests
import json

@app.task
def spam_filterAPI(comment_id):

    comment = Comment.objects.get(pk=comment_id)


    
    url = 'https://oopspam.p.rapidapi.com/v1/spamdetection'
    headers = { 'Content-Type': 'application/json' ,
    'x-rapidapi-host': 'oopspam.p.rapidapi.com' ,
     'x-rapidapi-key': 'c5deb3c22cmsh634107850b4e158p1f5cddjsn1f247a180512' }
    data={'content':str(comment.body)}
    x = requests.post(url, data = json.dumps(data), headers =headers)
    js_body= json.loads(x.text)
    try:
        if js_body['Details']['isContentSpam']=='nospam':
            print('nospam')
        else:
            comment.is_spam=True
            comment.save
    except:
        pass

    

    return js_body

# temporary code for  filtering spams until getting API keys for Akismet
""" 
def comment_check(comment_id):
    print("entering comment check")

    explicit_words=[ "fuck","bitch"]
    comment = Comment.objects.get(pk=comment_id)
    wannacheck_text = str(comment.body)

    for word in explicit_words:
       # print(word)
        if word in wannacheck_text:
            filtered_text = wannacheck_text.replace(str(word), str('#$@*'))
           # print(filtered_text)

            if str(filtered_text) != str(wannacheck_text):
                comment.is_spam=True

                comment.save()

   # print(filtered_text)

    return filtered_text

@app.task
def spam_filter(comment_id):

    comment = Comment.objects.get(pk=comment_id)

    fixed_comment = comment_check(comment.id)
    comment.body = fixed_comment
    comment.save()
#
#adding redis
#
    cache.set('comment', comment.body, timeout=3)
    return comment.body
 """



""" 
@app.task
def spam_filter(comment_id, remote_addr=None):
    print("entering spam task")
    logger = spam_filter.get_logger()
    logger.info('Running spam filter for comment %s', comment_id)

    comment = Comment.objects.get(pk=comment_id)
    print("tasks",comment)
    current_domain = Site.objects.get_current().domain
    akismet = Akismet(settings.AKISMET_KEY, 'http://{0}'.format(domain))
    if not akismet.verify_key():
        raise ImproperlyConfigured('Invalid AKISMET_KEY')


    is_spam = akismet.comment_check(user_ip=remote_addr,
                        comment_content=comment.body,
                        comment_author=comment.user,
                        comment_author_email=comment.user.email)
    if is_spam:
        comment.is_spam = True
        comment.save()

    return is_spam """