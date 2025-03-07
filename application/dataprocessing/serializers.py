from rest_framework import serializers, viewsets
from .models import User, Items, Domain, Relation
from workprogramsapp.models import WorkProgram

class userProfileSerializer(serializers.ModelSerializer):
    """Сериализатор для работы с акканутами"""
    #user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username','first_name', 'last_name', 'email', 'isu_number')


class DomainSerializer(serializers.ModelSerializer):
    """Сериализатор для предметной области"""
    user=serializers.PrimaryKeyRelatedField(required= False, many=True, queryset=User.objects.all())
 
    class Meta:
        model = Domain
        fields = ('id', 'name','user')
        extra_kwargs = {
            'user': {'required': False}
        }
        # read_only_fields = ('user',)



class ItemCreateSerializer(serializers.ModelSerializer):
    """Сериализатор Ключевого слова"""
    class Meta:
        model = Items
        fields = ('id','name','domain')


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class DomainForItemSerializer(serializers.ModelSerializer):
    """Сериализатор для предметной области"""

    class Meta:
        model = Domain
        fields = ('id', 'name')


class ItemSerializer(serializers.ModelSerializer):
    """Сериализатор Ключевого слова"""
    domain = DomainForItemSerializer()
     
    class Meta:
        model = Items
        fields = ('id','name','domain','value',)
        #depth = 1

    
class ItemWithRelationSerializer(serializers.ModelSerializer):
    """Сериализатор Ключевого слова со связями"""
    #relation_with_item = RecursiveField(many=True)
    relation_with_item = serializers.SerializerMethodField()
    
    class Meta:
        model = Items
        fields = ('id','name','domain','value','relation_with_item',)
        depth = 1

    def get_relation_with_item(self, obj):
        """"obj is a Items instance. Returns list of dicts"""
        qset = Relation.objects.filter(item1=obj)
        return [RelationInSerializer(i).data for i in qset]


class RelationInSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения связей"""
    
    def to_representation(self,obj):  
        rep= super(RelationInSerializer,self).to_representation(obj)  
        rep['items']= [ ItemCreateSerializer(relation.item2).data for relation in Relation.objects.filter(item1 = obj.item1, relation=obj.relation).distinct()]  
        return rep  
    
    class Meta:
        model = Relation
        fields = ('relation',)


class RelationSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения связей"""
    item1 = ItemSerializer()
    item2 = ItemSerializer()
    class Meta:
        model = Relation
        fields = ('id', 'item1','relation','item2', 'count')

class RelationCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания связей"""
    class Meta:
        model = Relation
        fields = ('id', 'item1','relation','item2',)


class RelationUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления связей"""
    class Meta:
        model = Relation
        fields = ('item1','relation','item2', 'count')


class FileUploadSerializer(serializers.Serializer):
    """Сериализатор для добавления связей"""
    file = serializers.FileField(use_url=False)


class WorkProgramShortSerializer(serializers.ModelSerializer):
    """Сериализатор рабочих программ"""

    class Meta:
        model = WorkProgram
        fields = ['id', 'title']


class ItemWithRelationForSearchDuplicatesSerializer(serializers.ModelSerializer):
    """Сериализатор Ключевого слова со связями"""
    WorkProgramPrerequisites = WorkProgramShortSerializer(many=True)
    WorkProgramOutcomes = WorkProgramShortSerializer(many=True)

    class Meta:
        model = Items
        fields = ('id','name','domain','value', 'WorkProgramPrerequisites', 'WorkProgramOutcomes')
