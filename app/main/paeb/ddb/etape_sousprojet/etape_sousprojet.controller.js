(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.etape_sousprojet')
        .controller('Etape_sousprojetController', Etape_sousprojetController);
    /** @ngInject */
    function Etape_sousprojetController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alletape_sousprojet = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.etape_sousprojet_column = [
        {titre:"Libelle"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée etape_sousprojet
        apiFactory.getAll("etape_sousprojet/index").then(function(result)
        {
            vm.alletape_sousprojet = result.data.response; 
            console.log(vm.alletape_sousprojet);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.alletape_sousprojet.length>0)
            {
                var last_tranche = Math.max.apply(Math, vm.alletape_sousprojet.map(function(o)
                { 
                  numcode=o.code.split(' ')[1];
                  return numcode;
                }));
                //console.log(numcode);
                var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  libelle: '',         
                  description: '',
                  code: 'etape '+(parseInt(numcode)+1)
                };         
                vm.alletape_sousprojet.push(items);
                vm.alletape_sousprojet.forEach(function(pres)
                {
                  if(pres.$selected==true)
                  {
                    vm.selectedItem = pres;
                  }
                });

                NouvelItem = true ;
            }else
            {
              var items = {
                  $edit: true,
                  $selected: true,
                  id: '0',
                  libelle: '',         
                  description: '',
                  code: 'etape '+numcode
                };         
                vm.alletape_sousprojet.push(items);
                vm.alletape_sousprojet.forEach(function(pres)
                {
                  if(pres.$selected==true)
                  {
                    vm.selectedItem = pres;
                  }
                });

                NouvelItem = true ;
            }
           
          }else
          {
            vm.showAlert('Ajout tranche demande moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(etape_sousprojet,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (etape_sousprojet,suppression); 
            } 
            else
            {
                insert_in_base(etape_sousprojet,suppression);
            }
        }

        //fonction de bouton d'annulation etape_sousprojet
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code = currentItem.code ;
            item.libelle  = currentItem.libelle  ;
            item.description= currentItem.description ;  
          }else
          {
            vm.alletape_sousprojet = vm.alletape_sousprojet.filter(function(obj)
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
           // vm.alletape_sousprojet= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alletape_sousprojet) return;
             vm.alletape_sousprojet.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item etape_sousprojet
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alletape_sousprojet.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.libelle       = vm.selectedItem.libelle;
            item.description     = vm.selectedItem.description ; 
        };

        //fonction bouton suppression item etape_sousprojet
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enetape_sousprojetistrement ?')
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

        //function teste s'il existe une modification item etape_sousprojet
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.alletape_sousprojet.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(tranc[0])
                {
                   if((tranc[0].libelle!=currentItem.libelle) 
                    || (tranc[0].code!=currentItem.code)
                    || (tranc[0].description!=currentItem.description))                    
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

        //insertion ou mise a jours ou suppression item dans bdd etape_sousprojet
        function insert_in_base(etape_sousprojet,suppression)
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
                    id:     getId,      
                    code:   etape_sousprojet.code,
                    libelle:    etape_sousprojet.libelle,     
                    description:  etape_sousprojet.description,               
                });
                //console.log(etape_sousprojet.pays_id);
                //factory
            apiFactory.add("etape_sousprojet/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alletape_sousprojet = vm.alletape_sousprojet.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  etape_sousprojet.id  =   String(data.response);              
                  NouvelItem=false;
            }
              etape_sousprojet.$selected = false;
              etape_sousprojet.$edit = false;
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