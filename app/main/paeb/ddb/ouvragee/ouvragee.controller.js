(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ouvragee')
        .controller('OuvrageeController', OuvrageeController);
    /** @ngInject */
    function OuvrageeController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allouvrage = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.ouvrage_column = [{titre:"Libelle"},{titre:"Description"},{titre:"Action"}];
        
        //recuperation donnée ouvrage
        apiFactory.getAll("ouvrage/index").then(function(result)
        {
            vm.allouvrage = result.data.response; 
            //console.log(vm.allouvrage);
        });

        //recuperation donnée district
        apiFactory.getAll("district/index").then(function(result)
        {
          vm.alldistrict= result.data.response;
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
            vm.allouvrage.push(items);
            vm.allouvrage.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout ouvrage','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(ouvrage,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (ouvrage,suppression); 
            } 
            else
            {
                insert_in_base(ouvrage,suppression);
            }
        }

        //fonction de bouton d'annulation ouvrage
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
            vm.allouvrage = vm.allouvrage.filter(function(obj)
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
           // vm.allouvrage= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allouvrage) return;
             vm.allouvrage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item ouvrage
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allouvrage.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.libelle      = vm.selectedItem.libelle ;
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item ouvrage
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enouvrageistrement ?')
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

        //function teste s'il existe une modification item ouvrage
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allouvrage.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd ouvrage
        function insert_in_base(ouvrage,suppression)
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
                    libelle:     ouvrage.libelle,
                    description: ouvrage.description               
                });
                //console.log(ouvrage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("categorie_ouvrage/index",datas, config).success(function (data)
            {

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = ouvrage.description;
                        vm.selectedItem.libelle       = ouvrage.libelle;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allouvrage = vm.allouvrage.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  ouvrage.description =  ouvrage.description;
                  ouvrage.libelle=  ouvrage.libelle;
                  ouvrage.id  =   String(data.response);              
                  NouvelItem=false;
            }
              ouvrage.$selected = false;
              ouvrage.$edit = false;
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
