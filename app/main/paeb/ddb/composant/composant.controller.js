(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.composant')
        .controller('ComposantController', ComposantController);
    /** @ngInject */
    function ComposantController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allcomposant = [] ;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          responsive: true          
        };

        //col table
        vm.composant_column = [{titre:"Zone subvention"},{titre:"Acces zone"},{titre:"Cout maitrise d'oeuvre"},{titre:"Cout sous projet"},{titre:"Action"}];
        
        //recuperation donnée composant
        apiFactory.getAll("composant/index").then(function(result)
        {
            vm.allcomposant = result.data.response; 
            //console.log(vm.allcomposant);
        });

        //recuperation donnée zone_subvention
        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
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
              id_zone_subvention: '',         
              id_acces_zone: '',
              cout_maitrise_oeuvre: '',         
              cout_sous_projet: ''
            };         
            vm.allcomposant.push(items);
            vm.allcomposant.forEach(function(pres)
            {
              if(pres.$selected==true)
              {
                vm.selectedItem = pres;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout composant','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(composant,suppression)
        {
            var detail = vm.allcomposant.filter(function(objs)
            {return objs.id != currentItem.id;}).filter(function(obj)
              {
                  return obj.zone_subvention.id == composant.id_zone_subvention && obj.acces_zone.id == composant.id_acces_zone;
              });
                console.log(detail);
            /* fin verification doublon*/

            if (detail[0])
            {
              vm.showAlert('Doublon','La zone de subvention et acces zone existe déjà');
            }
            else
            {
              if (NouvelItem==false)
              {
                  test_existance (composant,suppression); 
              } 
              else
              {  
                  insert_in_base(composant,suppression);
              }
            }
          
        }

        //fonction de bouton d'annulation composant
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_zone_subvention = currentItem.id_zone_subvention ;
            item.id_acces_zone  = currentItem.id_acces_zone  ;
            item.cout_maitrise_oeuvre  = currentItem.cout_maitrise_oeuvre ; 
            item.cout_sous_projet = currentItem.cout_sous_projet ; 
          }else
          {
            vm.allcomposant = vm.allcomposant.filter(function(obj)
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
           // vm.allcomposant= [] ; 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allcomposant) return;
             vm.allcomposant.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item composant
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allcomposant.forEach(function(pres) {
              pres.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.id_zone_subvention      = vm.selectedItem.zone_subvention.id ;
            item.id_acces_zone       = vm.selectedItem.acces_zone.id;
            item.cout_maitrise_oeuvre = parseInt(vm.selectedItem.cout_maitrise_oeuvre ) ;
            item.cout_sous_projet      = parseInt(vm.selectedItem.cout_sous_projet) ; 
        };

        //fonction bouton suppression item composant
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet encomposantistrement ?')
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

        //function teste s'il existe une modification item composant
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allcomposant.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].id_acces_zone!=currentItem.id_acces_zone) 
                    || (cis[0].id_zone_subvention!=currentItem.id_zone_subvention)
                    || (cis[0].cout_maitrise_oeuvre!=currentItem.cout_maitrise_oeuvre)
                    || (cis[0].cout_sous_projet!=currentItem.cout_sous_projet))                    
                      { 
                         if((cis[0].id_zone_subvention!=currentItem.id_zone_subvention) 
                            || (cis[0].id_acces_zone!=currentItem.id_acces_zone))
                          {
                            var det = vm.allcomposant.filter(function(objs)
                              {return objs.id != currentItem.id;}).filter(function(obj)
                                {
                                    return obj.zone_subvention.id == item.id_zone_subvention && obj.acces_zone.id == item.id_acces_zone;
                                });
                                  console.log(det);
                              /* fin verification doublon*/

                            if (det[0])
                            {
                              vm.showAlert('Doublon','La zone de subvention et acces zone existe déjà');
                            }
                            else
                            { 
                                insert_in_base(item,suppression);
                              
                            }
                          }
                          else
                          {
                            insert_in_base(item,suppression);
                          }
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

        //insertion ou mise a jours ou suppression item dans bdd composant
        function insert_in_base(composant,suppression)
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
                    id_zone_subvention:   composant.id_zone_subvention,
                    id_acces_zone:    composant.id_acces_zone,      
                    cout_maitrise_oeuvre:    composant.cout_maitrise_oeuvre,      
                    cout_sous_projet:   composant.cout_sous_projet               
                });
                //console.log(composant.pays_id);
                //factory
            apiFactory.add("composant/index",datas, config).success(function (data)
            {   

                var zosub = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == composant.id_zone_subvention;
                });

                var azone = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == composant.id_acces_zone;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.zone_subvention  = zosub[0];
                        vm.selectedItem.acces_zone       = azone[0];
                        vm.selectedItem.cout_maitrise_oeuvre       = composant.cout_maitrise_oeuvre;
                        vm.selectedItem.cout_sous_projet       = composant.cout_sous_projet;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allcomposant = vm.allcomposant.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  composant.zone_subvention =  zosub[0];
                  composant.acces_zone=  azone[0];
                  composant.cout_maitrise_oeuvre =  composant.cout_maitrise_oeuvre;
                  composant.cout_sous_projet=  composant.cout_sous_projet;
                  composant.id  =   String(data.response);              
                  NouvelItem=false;
            }
              composant.$selected = false;
              composant.$edit = false;
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
