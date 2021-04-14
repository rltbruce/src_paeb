(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_deblocage_feffi')
        .controller('Tranche_deblocage_feffiController', Tranche_deblocage_feffiController);
    /** @ngInject */
    function Tranche_deblocage_feffiController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltranche_deblocage_feffi = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          order:[]           
        };

        //col table
        vm.tranche_deblocage_feffi_column = [
        {titre:"Libelle"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée tranche_deblocage_feffi
        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
            vm.alltranche_deblocage_feffi = result.data.response; 
            console.log(vm.alltranche_deblocage_feffi);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.alltranche_deblocage_feffi.length>0)
            {
                var last_tranche = Math.max.apply(Math, vm.alltranche_deblocage_feffi.map(function(o)
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
                  periode: '',
                  pourcentage: '',         
                  description: '',
                  code: 'tranche '+(parseInt(numcode)+1)
                };         
                vm.alltranche_deblocage_feffi.unshift(items);
                vm.alltranche_deblocage_feffi.forEach(function(pres)
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
                  periode: '',
                  pourcentage: '',         
                  description: '',
                  code: 'tranche '+numcode
                };         
                vm.alltranche_deblocage_feffi.unshift(items);
                vm.alltranche_deblocage_feffi.forEach(function(pres)
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
            vm.showAlert('Ajout tranche demande mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(tranche_deblocage_feffi,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (tranche_deblocage_feffi,suppression); 
            } 
            else
            {
                insert_in_base(tranche_deblocage_feffi,suppression);
            }
        }

        //fonction de bouton d'annulation tranche_deblocage_feffi
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code = currentItem.code ;
            item.libelle  = currentItem.libelle  ;
            item.periode  = currentItem.periode ; 
            item.pourcentage = currentItem.pourcentage ; 
            item.description= currentItem.description ;  
          }else
          {
            vm.alltranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
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
           // vm.alltranche_deblocage_feffi= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltranche_deblocage_feffi) return;
             vm.alltranche_deblocage_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item tranche_deblocage_feffi
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltranche_deblocage_feffi.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.libelle       = vm.selectedItem.libelle;
            item.periode       = vm.selectedItem.periode ;
            item.pourcentage      = vm.selectedItem.pourcentage ;
            item.description     = vm.selectedItem.description ; 
        };

        //fonction bouton suppression item tranche_deblocage_feffi
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet entranche_deblocage_feffiistrement ?')
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

        //function teste s'il existe une modification item tranche_deblocage_feffi
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.alltranche_deblocage_feffi.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(tranc[0])
                {
                   if((tranc[0].libelle!=currentItem.libelle) 
                    || (tranc[0].code!=currentItem.code)
                    || (tranc[0].periode!=currentItem.periode)
                    || (tranc[0].pourcentage!=currentItem.pourcentage)
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

        //insertion ou mise a jours ou suppression item dans bdd tranche_deblocage_feffi
        function insert_in_base(tranche_deblocage_feffi,suppression)
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
                    code:   tranche_deblocage_feffi.code,
                    libelle:    tranche_deblocage_feffi.libelle,      
                    periode:    tranche_deblocage_feffi.periode,      
                    pourcentage:   tranche_deblocage_feffi.pourcentage,      
                    description:  tranche_deblocage_feffi.description,               
                });
                //console.log(tranche_deblocage_feffi.pays_id);
                //factory
            apiFactory.add("tranche_deblocage_feffi/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.libelle        = tranche_deblocage_feffi.libelle;
                        vm.selectedItem.code       = tranche_deblocage_feffi.code;
                        vm.selectedItem.periode       = tranche_deblocage_feffi.periode;
                        vm.selectedItem.pourcentage       = tranche_deblocage_feffi.pourcentage;
                        vm.selectedItem.description       = tranche_deblocage_feffi.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltranche_deblocage_feffi = vm.alltranche_deblocage_feffi.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  tranche_deblocage_feffi.libelle =  tranche_deblocage_feffi.libelle;
                  tranche_deblocage_feffi.code=  tranche_deblocage_feffi.code;
                  tranche_deblocage_feffi.periode =  tranche_deblocage_feffi.periode;
                  tranche_deblocage_feffi.pourcentage=  tranche_deblocage_feffi.pourcentage;
                  tranche_deblocage_feffi.description =  tranche_deblocage_feffi.description;
                  tranche_deblocage_feffi.id  =   String(data.response);              
                  NouvelItem=false;
            }
              tranche_deblocage_feffi.$selected = false;
              tranche_deblocage_feffi.$edit = false;
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