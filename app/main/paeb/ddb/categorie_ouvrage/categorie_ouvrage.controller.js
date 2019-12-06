(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.categorie_ouvrage')
        .controller('Categorie_ouvrageController', Categorie_ouvrageController);
    /** @ngInject */
    function Categorie_ouvrageController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allcategorie_ouvrage = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.categorie_ouvrage_column = [{titre:"libelle"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée categorie_ouvrage
        apiFactory.getAll("categorie_ouvrage/index").then(function(result)
        {
            vm.allcategorie_ouvrage = result.data.response; 
            //console.log(vm.allcategorie_ouvrage);
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
            vm.allcategorie_ouvrage.push(items);
            vm.allcategorie_ouvrage.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout categorie_ouvrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(categorie_ouvrage,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (categorie_ouvrage,suppression); 
            } 
            else
            {
                insert_in_base(categorie_ouvrage,suppression);
            }
        }

        //fonction de bouton d'annulation categorie_ouvrage
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
            vm.allcategorie_ouvrage = vm.allcategorie_ouvrage.filter(function(obj)
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
           // vm.allcategorie_ouvrage= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allcategorie_ouvrage) return;
             vm.allcategorie_ouvrage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item categorie_ouvrage
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allcategorie_ouvrage.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.libelle      = vm.selectedItem.libelle ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item categorie_ouvrage
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet encategorie_ouvrageistrement ?')
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

        //function teste s'il existe une modification item categorie_ouvrage
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allcategorie_ouvrage.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd categorie_ouvrage
        function insert_in_base(categorie_ouvrage,suppression)
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
                    libelle:      categorie_ouvrage.libelle,
                    description: categorie_ouvrage.description              
                });
                console.log(datas);
                //factory
            apiFactory.add("categorie_ouvrage/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = categorie_ouvrage.description;
                       vm.selectedItem.libelle       = categorie_ouvrage.libelle;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allcategorie_ouvrage = vm.allcategorie_ouvrage.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  categorie_ouvrage.description =  categorie_ouvrage.description;
                  categorie_ouvrage.libelle=  categorie_ouvrage.libelle;
                  categorie_ouvrage.id  =   String(data.response);              
                  NouvelItem=false;
            }
              categorie_ouvrage.$selected = false;
              categorie_ouvrage.$edit = false;
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
