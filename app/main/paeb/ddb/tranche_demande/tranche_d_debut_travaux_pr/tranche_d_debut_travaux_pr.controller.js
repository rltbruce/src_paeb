(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.tranche_demande.tranche_d_debut_travaux_pr')
        .controller('Tranche_d_debut_travaux_prController', Tranche_d_debut_travaux_prController);
    /** @ngInject */
    function Tranche_d_debut_travaux_prController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alltranche_d_debut_travaux_pr = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.tranche_d_debut_travaux_pr_column = [
        {titre:"Libelle"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Description"},
        {titre:"Code"},
        {titre:"Action"}
        ];
        
        //recuperation donnée tranche_d_debut_travaux_pr
        apiFactory.getAll("tranche_d_debut_travaux_pr/index").then(function(result)
        {
            vm.alltranche_d_debut_travaux_pr = result.data.response; 
            console.log(vm.alltranche_d_debut_travaux_pr);
        });

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          { var numcode=1;
            
            if (vm.alltranche_d_debut_travaux_pr.length>0)
            {
                var last_tranche = Math.max.apply(Math, vm.alltranche_d_debut_travaux_pr.map(function(o)
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
                vm.alltranche_d_debut_travaux_pr.push(items);
                vm.alltranche_d_debut_travaux_pr.forEach(function(pres)
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
                vm.alltranche_d_debut_travaux_pr.push(items);
                vm.alltranche_d_debut_travaux_pr.forEach(function(pres)
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
            vm.showAlert('Ajout tranche demande_latrine pr','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(tranche_d_debut_travaux_pr,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (tranche_d_debut_travaux_pr,suppression); 
            } 
            else
            {
                insert_in_base(tranche_d_debut_travaux_pr,suppression);
            }
        }

        //fonction de bouton d'annulation tranche_d_debut_travaux_pr
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
            vm.alltranche_d_debut_travaux_pr = vm.alltranche_d_debut_travaux_pr.filter(function(obj)
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
           // vm.alltranche_d_debut_travaux_pr= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alltranche_d_debut_travaux_pr) return;
             vm.alltranche_d_debut_travaux_pr.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item tranche_d_debut_travaux_pr
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alltranche_d_debut_travaux_pr.forEach(function(pres) {
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

        //fonction bouton suppression item tranche_d_debut_travaux_pr
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

        //function teste s'il existe une modification item tranche_d_debut_travaux_pr
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var tranc = vm.alltranche_d_debut_travaux_pr.filter(function(obj)
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

        //insertion ou mise a jours ou suppression item dans bdd tranche_d_debut_travaux_pr
        function insert_in_base(tranche_d_debut_travaux_pr,suppression)
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
                    code:   tranche_d_debut_travaux_pr.code,
                    libelle:    tranche_d_debut_travaux_pr.libelle,      
                    periode:    tranche_d_debut_travaux_pr.periode,      
                    pourcentage:   tranche_d_debut_travaux_pr.pourcentage,      
                    description:  tranche_d_debut_travaux_pr.description,               
                });
                //console.log(tranche_d_debut_travaux_pr.pays_id);
                //factory
            apiFactory.add("tranche_d_debut_travaux_pr/index",datas, config).success(function (data)
            {
                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.libelle        = tranche_d_debut_travaux_pr.libelle;
                        vm.selectedItem.code       = tranche_d_debut_travaux_pr.code;
                        vm.selectedItem.periode       = tranche_d_debut_travaux_pr.periode;
                        vm.selectedItem.pourcentage       = tranche_d_debut_travaux_pr.pourcentage;
                        vm.selectedItem.description       = tranche_d_debut_travaux_pr.description;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alltranche_d_debut_travaux_pr = vm.alltranche_d_debut_travaux_pr.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  tranche_d_debut_travaux_pr.libelle =  tranche_d_debut_travaux_pr.libelle;
                  tranche_d_debut_travaux_pr.code=  tranche_d_debut_travaux_pr.code;
                  tranche_d_debut_travaux_pr.periode =  tranche_d_debut_travaux_pr.periode;
                  tranche_d_debut_travaux_pr.pourcentage=  tranche_d_debut_travaux_pr.pourcentage;
                  tranche_d_debut_travaux_pr.description =  tranche_d_debut_travaux_pr.description;
                  tranche_d_debut_travaux_pr.id  =   String(data.response);              
                  NouvelItem=false;
            }
              tranche_d_debut_travaux_pr.$selected = false;
              tranche_d_debut_travaux_pr.$edit = false;
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