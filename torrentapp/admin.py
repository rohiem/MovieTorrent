from django.contrib import admin
from .models import Movie, Cat, UserProfile
# Register your models here.


# class DocumentAdmin(admin.ModelAdmin):
#    list_display = ('doc_name',)


admin.site.register(Movie
                    # , DocumentAdmin
                    )
admin.site.register(Cat)
admin.site.register(UserProfile)
