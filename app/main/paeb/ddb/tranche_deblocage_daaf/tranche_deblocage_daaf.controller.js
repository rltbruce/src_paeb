(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_deblocage_daaf')
        .controller('Tranche_deblocage_daafController', Tranche_deblocage_daafController);
    /** @ngInject */
    function Tranche_deblocage_daafController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltranche_deblocage_daaf = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.tranche_deblocage_daaf_column = [
        {titre:"Libelle"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée tranche_deblocage_daaf
        apiFactory.getAll("tranche_deblocage_daaf/index").then(function(result)
        {
            vm.alltranche_deblocage_daaf = result.data.response; 
            console.log(vm.alltranche_deblocage_daaf);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.alltranche_deblocage_daaf.length>0)
            {
                var last_tranche = Math.max.apply(Math, vm.alltranche_deblocage_daaf.map(function(o)
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
                vm.alltranche_deblocage_daaf.push(items);
                vm.alltranche_deblocage_daaf.forEach(function(pres)
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
                vm.alltranche_deblocage_daaf.push(items);
                vm.alltranche_deblocage_daaf.forEach(function(pres)
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
        function ajout(tranche_deblocage_daaf,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (tranche_deblocage_daaf,suppression); 
            } 
            else
            {
                insert_in_base(tranche_deblocage_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation tranche_deblocage_daaf
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
            vm.alltranche_deblocage_daaf = vm.alltranche_deblocage_daaf.filter(function(obj)
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
           // vm.alltranche_deblocage_daaf= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltranche_deblocage_daaf) return;
             vm.alltranche_deblocage_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item tranche_deblocage_daaf
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltranche_deblocage_daaf.forEach(function(pres) {
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

        //fonction bouton suppression item tranche_deblocage_daaf
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

        //function teste s'il existe une modification item tranche_deblocage_daaf
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.alltranche_deblocage_daaf.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd tranche_deblocage_daaf
        function insert_in_base(tranche_deblocage_daaf,suppression)
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
                    code:   tranche_deblocage_daaf.code,
                    libelle:    tranche_deblocage_daaf.libelle,      
                    periode:    tranche_deblocage_daaf.periode,      
                    pourcentage:   tranche_deblocage_daaf.pourcentage,      
                    description:  tranche_deblocage_daaf.description,               
                });
                //console.log(tranche_deblocage_daaf.pays_id);
                //factory
            apiFactory.add("tranche_deblocage_daaf/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.libelle        = tranche_deblocage_daaf.libelle;
                        vm.selectedItem.code       = tranche_deblocage_daaf.code;
                        vm.selectedItem.periode       = tranche_deblocage_daaf.periode;
                        vm.selectedItem.pourcentage       = tranche_deblocage_daaf.pourcentage;
                        vm.selectedItem.description       = tranche_deblocage_daaf.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltranche_deblocage_daaf = vm.alltranche_deblocage_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  tranche_deblocage_daaf.libelle =  tranche_deblocage_daaf.libelle;
                  tranche_deblocage_daaf.code=  tranche_deblocage_daaf.code;
                  tranche_deblocage_daaf.periode =  tranche_deblocage_daaf.periode;
                  tranche_deblocage_daaf.pourcentage=  tranche_deblocage_daaf.pourcentage;
                  tranche_deblocage_daaf.description =  tranche_deblocage_daaf.description;
                  tranche_deblocage_daaf.id  =   String(data.response);              
                  NouvelItem=false;
            }
              tranche_deblocage_daaf.$selected = false;
              tranche_deblocage_daaf.$edit = false;
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