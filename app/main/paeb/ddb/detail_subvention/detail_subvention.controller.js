(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.detail_subvention')
        .controller('Detail_subventionController', Detail_subventionController);
    /** @ngInject */
    function Detail_subventionController($mdDialog, $scope, apiFactory, $state)
    {
		   var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.alldetail_subvention = [] ;
        vm.allzone_subvention = [] ;
        vm.allacces_zone = [] ;
        vm.alldetail_ouvrage = [] ;

        //style responsive: true
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //col table
        vm.detail_subvention_column = [
        {
          titre:"Zone subvention"
        },
        {
          titre:"Accés zone"
        },
        {
          titre:"Detail ouvrage"
        },
        {
          titre:"Coût maitrise d'oeuvre"
        },
        {
          titre:"Coût batiment"
        },
        {
          titre:"Coût latrine"
        },
        {
          titre:"Coût mobilier"
        },
        {
          titre:"Coût sousprojet"
        },
        {
          titre:"Action"
        }];
        
        //recuperation donnée detail_subvention
        apiFactory.getAll("detail_subvention/index").then(function(result)
        {
            vm.alldetail_subvention = result.data.response; 
        });

        //recuperation donnée zone_subvention
        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
            vm.allzone_subvention = result.data.response;
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
            vm.allacces_zone = result.data.response; 
        });

        //recuperation donnée detail_ouvrage
        apiFactory.getAll("detail_ouvrage/index").then(function(result)
        {
            vm.alldetail_ouvrage = result.data.response; console.log(vm.alldetail_ouvrage);
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
              id_acces_zone: '',
              id_zone_subvention: '',
              id_detail_ouvrage: '',
              cout_maitrise_oeuvre: '',         
              cout_batiment: '',
              cout_latrine: '',
              cout_mobilier: '',
              cout_sousprojet: ''
            };         
            vm.alldetail_subvention.push(items);
            vm.alldetail_subvention.forEach(function(detail)
            {
              if(detail.$selected==true)
              {
                vm.selectedItem = detail;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout detail_subvention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(detail_subvention,suppression)
        {
           /* if (NouvelItem==false)
            {
                test_existance (detail_subvention,suppression); 
            } 
            else
            {  
                insert_in_base(detail_subvention,suppression);
            }*/

            /* debut verification doublon*/
              
          var detail = vm.alldetail_subvention.filter(function(objs)
            {return objs.id != currentItem.id;}).filter(function(obj)
              {
                  return obj.zone_subvention.id == detail_subvention.id_zone_subvention && obj.acces_zone.id == detail_subvention.id_acces_zone && obj.detail_ouvrage.id == detail_subvention.id_detail_ouvrage;
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
                test_existance (detail_subvention,suppression); 
            } 
            else
            {  
                insert_in_base(detail_subvention,suppression);
            }
          }
        }

        //fonction de bouton d'annulation detail_subvention
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_zone_subvention  = currentItem.id_zone_subvention ;
            item.id_acces_zone       = currentItem.id_acces_zone ;
            item.id_detail_ouvrage       = currentItem.id_detail_ouvrage ;
            item.cout_maitrise_oeuvre = currentItem.cout_maitrise_oeuvre ;
            item.cout_batiment      = currentItem.cout_batiment ;
            item.cout_latrine       = currentItem.cout_latrine ; 
            item.cout_mobilier      = currentItem.cout_mobilier ;
            item.cout_sousprojet    = currentItem.cout_sousprojet ;   
          }else
          {
            vm.alldetail_subvention = vm.alldetail_subvention.filter(function(obj)
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
           // vm.alldetail_subvention= [] ;
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.alldetail_subvention) return;
             vm.alldetail_subvention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item detail_subvention
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.alldetail_subvention.forEach(function(detail) {
              detail.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.id_zone_subvention  = vm.selectedItem.zone_subvention.id ;
            item.id_acces_zone       = vm.selectedItem.acces_zone.id ;
            item.id_detail_ouvrage   = vm.selectedItem.detail_ouvrage.id ;
            item.cout_maitrise_oeuvre = vm.selectedItem.cout_maitrise_oeuvre ;
            item.cout_batiment      = vm.selectedItem.cout_batiment ;
            item.cout_latrine       = vm.selectedItem.cout_latrine ; 
            item.cout_mobilier      = vm.selectedItem.cout_mobilier ;
            item.cout_sousprojet    = vm.selectedItem.cout_sousprojet ; 
        };

        //fonction bouton suppression item detail_subvention
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

        //function teste s'il existe une modification item detail_subvention
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var detail = vm.alldetail_subvention.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(detail[0])
                {
                   if((detail[0].id_zone_subvention!=currentItem.id_zone_subvention) 
                    || (detail[0].id_acces_zone!=currentItem.id_acces_zone)
                    || (detail[0].id_detail_ouvrage!=currentItem.id_detail_ouvrage)
                    || (detail[0].cout_maitrise_oeuvre!=currentItem.cout_maitrise_oeuvre)
                    || (detail[0].cout_batiment!=currentItem.cout_batiment)
                    || (detail[0].cout_latrine!=currentItem.cout_latrine)
                    || (detail[0].cout_mobilier!=currentItem.cout_mobilier)
                    || (detail[0].cout_sousprojet!=currentItem.cout_sousprojet))                    
                      { 
                         //insert_in_base(item,suppression);

                         if((detail[0].id_zone_subvention!=currentItem.id_zone_subvention) 
                            || (detail[0].id_acces_zone!=currentItem.id_acces_zone)
                            || (detail[0].id_detail_ouvrage!=currentItem.id_detail_ouvrage))
                          {
                            var det = vm.alldetail_subvention.filter(function(objs)
                              {return objs.id != currentItem.id;}).filter(function(obj)
                                {
                                    return obj.zone_subvention.id == item.id_zone_subvention && obj.acces_zone.id == item.id_acces_zone && obj.detail_ouvrage.id == item.id_detail_ouvrage;
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

        //insertion ou mise a jours ou suppression item dans bdd detail_subvention
        function insert_in_base(detail_subvention,suppression)
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
                    id_zone_subvention: detail_subvention.id_zone_subvention,
                    id_acces_zone:      detail_subvention.id_acces_zone,
                    id_detail_ouvrage:  detail_subvention.id_detail_ouvrage,
                    cout_maitrise_oeuvre: detail_subvention.cout_maitrise_oeuvre,
                    cout_batiment:      detail_subvention.cout_batiment,
                    cout_latrine:       detail_subvention.cout_latrine,    
                    cout_mobilier:      detail_subvention.cout_mobilier,
                    cout_sousprojet:    detail_subvention.cout_sousprojet              
                });
                
                //factory
            apiFactory.add("detail_subvention/index",datas, config).success(function (data)
            {
                var zone = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == detail_subvention.id_zone_subvention;
                });

                var acces = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == detail_subvention.id_acces_zone;
                });

                var de_ouvr = vm.alldetail_ouvrage.filter(function(obj)
                {
                    return obj.id == detail_subvention.id_detail_ouvrage;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.acces_zone      = acces[0];
                        vm.selectedItem.zone_subvention = zone[0];
                        vm.selectedItem.detail_ouvrage  = de_ouvr[0];
                        vm.selectedItem.cout_maitrise_oeuvre = detail_subvention.cout_maitrise_oeuvre;
                        vm.selectedItem.cout_batiment   = detail_subvention.cout_batiment;
                        vm.selectedItem.cout_latrine    = detail_subvention.cout_latrine;
                        vm.selectedItem.cout_mobilier   = detail_subvention.cout_mobilier;
                        vm.selectedItem.cout_sousprojet = detail_subvention.cout_sousprojet;
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.alldetail_subvention = vm.alldetail_subvention.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                {
                  detail_subvention.acces_zone      = acces[0];
                  detail_subvention.zone_subvention = zone[0];
                  detail_subvention.detail_ouvrage  = de_ouvr[0];
                  detail_subvention.cout_maitrise_oeuvre = detail_subvention.cout_maitrise_oeuvre;
                  detail_subvention.cout_batiment   = detail_subvention.cout_batiment;
                  detail_subvention.cout_latrine    = detail_subvention.cout_latrine;
                  detail_subvention.cout_mobilier   = detail_subvention.cout_mobilier;
                  detail_subvention.cout_sousprojet = detail_subvention.cout_sousprojet;
                  detail_subvention.id  =   String(data.response);              
                  NouvelItem=false;
            }
              detail_subvention.$selected = false;
              detail_subvention.$edit = false;
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
