(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.acces_zone')
        .controller('Acces_zoneController', Acces_zoneController);
    /** @ngInject */
    function Acces_zoneController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allacces_zone = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          order:[]           
        };

        //col table
        vm.acces_zone_column = [{titre:"Libelle"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
            vm.allacces_zone = result.data.response; 
            //console.log(vm.allacces_zone);
        });


        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              libelle: '',
              description: ''
            };         
            vm.allacces_zone.unshift(items);
            vm.allacces_zone.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout acces_zone','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(acces_zone,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (acces_zone,suppression); 
            } 
            else
            {
                insert_in_base(acces_zone,suppression);
            }
        }

        //fonction de bouton d'annulation acces_zone
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.libelle      = currentItem.libelle ;
            item.description       = currentItem.description ; 
          }else
          {
            vm.allacces_zone = vm.allacces_zone.filter(function(obj)
            {
                return obj.id !== vm.selectedItem.id;
            });
          }

          vm.selectedItem = {} ;
          NouvelItem      = false;
          
        };

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
            vm.nouvelItem   = item;
            currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
           // vm.allacces_zone= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allacces_zone) return;
             vm.allacces_zone.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item acces_zone
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allacces_zone.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.libelle      = vm.selectedItem.libelle ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item acces_zone
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajout(vm.selectedItem,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item acces_zone
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allacces_zone.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].libelle!=currentItem.libelle))                    
                      { 
                         insert_in_base(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_base(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd acces_zone
        function insert_in_base(acces_zone,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItem==false)
            {
                getId = vm.selectedItem.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    libelle:      acces_zone.libelle,
                    description: acces_zone.description              
                });
                console.log(datas);
                //factory
            apiFactory.add("acces_zone/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = acces_zone.description;
                       vm.selectedItem.libelle       = acces_zone.libelle;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allacces_zone = vm.allacces_zone.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  acces_zone.description =  acces_zone.description;
                  acces_zone.libelle=  acces_zone.libelle;
                  acces_zone.id  =   String(data.response);              
                  NouvelItem=false;
            }
              acces_zone.$selected = false;
              acces_zone.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();
