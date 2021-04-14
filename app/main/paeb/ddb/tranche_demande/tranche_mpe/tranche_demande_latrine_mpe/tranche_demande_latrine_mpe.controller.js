(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_mpe.tranche_demande_latrine_mpe')
        .controller('Tranche_demande_latrine_mpeController', Tranche_demande_latrine_mpeController);
    /** @ngInject */
    function Tranche_demande_latrine_mpeController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltranche_demande_latrine_mpe = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true,
          order:[]           
        };

        //col table
        vm.tranche_demande_latrine_mpe_column = [
        {titre:"Libelle"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée tranche_demande_latrine_mpe
        apiFactory.getAll("tranche_demande_latrine_mpe/index").then(function(result)
        {
            vm.alltranche_demande_latrine_mpe = result.data.response; 
            console.log(vm.alltranche_demande_latrine_mpe);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.alltranche_demande_latrine_mpe.length>0)
            {
                var last_tranche = Math.max.apply(Math, vm.alltranche_demande_latrine_mpe.map(function(o)
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
                vm.alltranche_demande_latrine_mpe.unshift(items);
                vm.alltranche_demande_latrine_mpe.forEach(function(pres)
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
                vm.alltranche_demande_latrine_mpe.unshift(items);
                vm.alltranche_demande_latrine_mpe.forEach(function(pres)
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
            vm.showAlert('Ajout tranche demande_latrine mpe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(tranche_demande_latrine_mpe,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (tranche_demande_latrine_mpe,suppression); 
            } 
            else
            {
                insert_in_base(tranche_demande_latrine_mpe,suppression);
            }
        }

        //fonction de bouton d'annulation tranche_demande_latrine_mpe
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
            vm.alltranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj)
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
           // vm.alltranche_demande_latrine_mpe= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltranche_demande_latrine_mpe) return;
             vm.alltranche_demande_latrine_mpe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item tranche_demande_latrine_mpe
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltranche_demande_latrine_mpe.forEach(function(pres) {
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

        //fonction bouton suppression item tranche_demande_latrine_mpe
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet entranche_demande_latrine_mpeistrement ?')
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

        //function teste s'il existe une modification item tranche_demande_latrine_mpe
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.alltranche_demande_latrine_mpe.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd tranche_demande_latrine_mpe
        function insert_in_base(tranche_demande_latrine_mpe,suppression)
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
                    code:   tranche_demande_latrine_mpe.code,
                    libelle:    tranche_demande_latrine_mpe.libelle,      
                    periode:    tranche_demande_latrine_mpe.periode,      
                    pourcentage:   tranche_demande_latrine_mpe.pourcentage,      
                    description:  tranche_demande_latrine_mpe.description,               
                });
                //console.log(tranche_demande_latrine_mpe.pays_id);
                //factory
            apiFactory.add("tranche_demande_latrine_mpe/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.libelle        = tranche_demande_latrine_mpe.libelle;
                        vm.selectedItem.code       = tranche_demande_latrine_mpe.code;
                        vm.selectedItem.periode       = tranche_demande_latrine_mpe.periode;
                        vm.selectedItem.pourcentage       = tranche_demande_latrine_mpe.pourcentage;
                        vm.selectedItem.description       = tranche_demande_latrine_mpe.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltranche_demande_latrine_mpe = vm.alltranche_demande_latrine_mpe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  tranche_demande_latrine_mpe.libelle =  tranche_demande_latrine_mpe.libelle;
                  tranche_demande_latrine_mpe.code=  tranche_demande_latrine_mpe.code;
                  tranche_demande_latrine_mpe.periode =  tranche_demande_latrine_mpe.periode;
                  tranche_demande_latrine_mpe.pourcentage=  tranche_demande_latrine_mpe.pourcentage;
                  tranche_demande_latrine_mpe.description =  tranche_demande_latrine_mpe.description;
                  tranche_demande_latrine_mpe.id  =   String(data.response);              
                  NouvelItem=false;
            }
              tranche_demande_latrine_mpe.$selected = false;
              tranche_demande_latrine_mpe.$edit = false;
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