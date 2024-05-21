from django.urls import re_path,path
from . import consumers
websocket_url=[
    


 re_path(r'ws/conversation/(?P<conversation_id>\d+)/(?P<user_id>\d+)/$', consumers.ConversationChat.as_asgi()),
    re_path(r'ws/broadcast/(?P<conversation_id>\d+)/$', consumers.MessageCustomer.as_asgi()),


   
    

]