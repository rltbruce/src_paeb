(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.taxe_marche_public')
        .controller('Taxe_marche_publicController', Taxe_marche_publicController);
    /** @ngInject */
    function Taxe_marche_publicController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltaxe_marche_public = [] ;
        vm.boutonnouveau = true;
        vm.affiche_load = true;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.taxe_marche_public_column = [{titre:"Description"},{titre:"Pourcentage"},{titre:"Action"}];
        
        //recuperation donnée taxe_marche_public
        apiFactory.getAll("taxe_marche_public/index").then(function(result)
        {   
            vm.alltaxe_marche_public = result.data.response;
            if (result.data.response.length>0)
            {
              vm.boutonnouveau = false;
            }

            vm.affiche_load = false; 
            //console.log(vm.alltaxe_marche_public);
        });


        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { 
              apiFactory.getAll("taxe_marche_public/index").then(function(result)
              {   
                  vm.alltaxe_marche_public = result.data.response;
                  if (result.data.response.length>0)
                  {
                    vm.boutonnouveau = false;
                    vm.showAlert('Ajout taxe marche public','Une valeur existe déjà!!!');
                  }
                  else
                  {                      
                      var items = {
                        $edit: true,
                        $selected: true,
                        id: '0',         
                        pourcentage: '',
                        description: ''
                      };         
                      vm.alltaxe_marche_public.push(items);
                      vm.alltaxe_marche_public.forEach(function(cis)
                      {
                        if(cis.$selected==true)
                        {
                          vm.selectedItem = cis;
                        }
                      });

                      NouvelItem = true ;
                  }

                  //console.log(vm.alltaxe_marche_public);
              });
          }else
          {
            vm.showAlert('Ajout taxe_marche_public','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(taxe_marche_public,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (taxe_marche_public,suppression); 
            } 
            else
            {
                insert_in_base(taxe_marche_public,suppression);
            }
        }

        //fonction de bouton d'annulation taxe_marche_public
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.pourcentage      = currentItem.pourcentage ;
            item.description       = currentItem.description ; 
          }else
          {
            vm.alltaxe_marche_public = vm.alltaxe_marche_public.filter(function(obj)
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
           // vm.alltaxe_marche_public= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltaxe_marche_public) return;
             vm.alltaxe_marche_public.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item taxe_marche_public
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltaxe_marche_public.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.pourcentage      = parseFloat(vm.selectedItem.pourcentage);
            item.description       = vm.selectedItem.description; 
        };

        //fonction bouton suppression item taxe_marche_public
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

        //function teste s'il existe une modification item taxe_marche_public
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.alltaxe_marche_public.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].pourcentage!=currentItem.pourcentage))                    
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

        //insertion ou mise a jours ou suppression item dans bdd taxe_marche_public
        function insert_in_base(taxe_marche_public,suppression)
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
                    pourcentage:      taxe_marche_public.pourcentage,
                    description: taxe_marche_public.description              
                });
                console.log(datas);
                //factory
            apiFactory.add("taxe_marche_public/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.description        = taxe_marche_public.description;
                       vm.selectedItem.pourcentage       = taxe_marche_public.pourcentage;;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltaxe_marche_public = vm.alltaxe_marche_public.filter(function(obj)
                      {   
                          vm.boutonnouveau = true;
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  taxe_marche_public.description =  taxe_marche_public.description;
                  taxe_marche_public.pourcentage=  taxe_marche_public.pourcentage;
                  taxe_marche_public.id  =   String(data.response);              
                  NouvelItem=false;
                  vm.boutonnouveau = false;
            }
              taxe_marche_public.$selected = false;
              taxe_marche_public.$edit = false;
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
