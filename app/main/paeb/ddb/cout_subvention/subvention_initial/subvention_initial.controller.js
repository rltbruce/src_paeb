(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.cout_subvention.subvention_initial')
        .controller('Subvention_initialController', Subvention_initialController);
    /** @ngInject */
    function Subvention_initialController($mdDialog, $scope, apiFactory, $state, uiGmapGoogleMapApi)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allsubvention_initial = [] ;

        vm.alltype_batiment = [] ;
        vm.alltype_latrine = [] ;
        vm.alltype_mobilier = [] ;
        vm.alltype_cout_maitrise = [] ;
        vm.alltype_cout_sousprojet = [] ;

        vm.allzone_subvention = [] ;
        vm.allacces_zone = [] ;

        vm.vuemap = false;
        vm.liste = [] ;
        vm.showwindow = false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false         
        };

        //col table
        vm.subvention_initial_column= [
        
        {titre:"Zone intervention"
        },
        {titre:"Acces zone"
        },
        {titre:"Type batiment"
        },
        {titre:"Nombre salle"
        },
        {titre:"Cout batiment"
        },
        {titre:"Type latrine"
        },
        {titre:"Nombre box"
        },
        {titre:"Cout latrine"
        },
        {titre:"Type mobilier"
        },
        {titre:"Nombre banc"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Type maitrise d'oeuvre"
        },
        {titre:"Cout maitrise d'oeuvre"
        },       
        {titre:"Type sous projet"
        },
        {titre:"Cout sous projet"
        },
        {titre:"Action"}];
        
        //recuperation donnée subvention_initial
        apiFactory.getAll("subvention_initial/index").then(function(result)
        {
            vm.allsubvention_initial = result.data.response; 
            console.log(vm.allsubvention_initial);
          
        });

        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
          console.log(vm.allzone_subvention);
        });
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
          console.log(vm.allacces_zone);
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
              id_type_batiment: '',
              id_type_latrine:'',
              id_type_mobilier: '',
              id_type_cout_maitrise: '',
              id_type_cout_sousprojet: ''
            };         
            vm.allsubvention_initial.push(items);
            vm.allsubvention_initial.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout subvention_initial','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(subvention_initial,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (subvention_initial,suppression);

            } 
            else
            {                
                var subsanido = vm.allsubvention_initial.filter(function(obj)
                {
                    return obj.id!=0;
                });
                if (subsanido.length!=0)
                {
                  var sub = subsanido.filter(function(obj)
                  {
                      return obj.zone_subvention.id == subvention_initial.id_zone_subvention && obj.acces_zone.id == subvention_initial.id_acces_zone;
                  });
                            
                  if (sub.length!=0)
                  {
                    vm.showAlert('Ajout refuser','Donnée en doublon');
                  }
                  else
                  {
                    insert_in_base(subvention_initial,suppression);
                  }
                }
                else
                {
                  insert_in_base(subvention_initial,suppression);
                }
                
            }
        }

        //fonction de bouton d'annulation subvention_initial
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.id_zone_subvention  = currentItem.zone_subvention.id ;
            item.id_acces_zone    = currentItem.acces_zone.id ;

            item.id_type_batiment  = currentItem.type_batiment.id ;
            item.id_type_cout_maitrise    = currentItem.type_cout_maitrise.id ;
            item.id_type_cout_sousprojet   = currentItem.type_cout_sousprojet.id ;
            item.id_type_latrine = currentItem.type_latrine.id;
            item.id_type_mobilier    = currentItem.type_mobilier.id; 

            item.nbr_salle    = currentItem.type_batiment.nbr_salle ;
            item.cout_batiment   = currentItem.type_batiment.cout_batiment ;

            item.nbr_box = currentItem.type_latrine.nbr_box_latrine;
            item.cout_latrine    = currentItem.type_latrine.cout_latrine;

            item.nbr_banc  = currentItem.type_mobilier.nbr_table_banc ;
            item.cout_mobilier    = currentItem.type_mobilier.cout_mobilier ;

            item.cout_maitrise   = currentItem.type_cout_maitrise.cout_maitrise ;
            item.cout_sousprojet = currentItem.type_cout_sousprojet.cout_sousprojet;
          }else
          {
            vm.allsubvention_initial = vm.allsubvention_initial.filter(function(obj)
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
            //vm.nouvelItem   = item;
            if (item.$edit==false || item.$edit== undefined)
            {
              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
              console.log(currentItem );
            } 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allsubvention_initial) return;
             vm.allsubvention_initial.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item subvention_initial
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allsubvention_initial.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getByZone','id_zone_subvention',item.zone_subvention.id,'id_acces_zone',item.acces_zone.id).then(function(result)
            {
                  vm.alltype_batiment = result.data.response; 
                  console.log(vm.alltype_batiment);
            });

            apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',item.zone_subvention.id,'id_acces_zone',item.acces_zone.id).then(function(result)
            {
                  vm.alltype_latrine = result.data.response; 
                  console.log(vm.alltype_latrine);
            });
            apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',item.zone_subvention.id,'id_acces_zone',item.acces_zone.id).then(function(result)
            {
                  vm.alltype_mobilier = result.data.response; 
                  console.log(vm.alltype_mobilier);
            });
            apiFactory.getAPIgeneraliserREST("type_cout_sousprojet/index",'menu','getByZone','id_zone_subvention',item.zone_subvention.id,'id_acces_zone',item.acces_zone.id).then(function(result)
            {
                  vm.alltype_cout_sousprojet = result.data.response; 
                  console.log(vm.alltype_cout_sousprojet);
            });
            apiFactory.getAPIgeneraliserREST("type_cout_maitrise/index",'menu','getByZone','id_zone_subvention',item.zone_subvention.id,'id_acces_zone',item.acces_zone.id).then(function(result)
            {
                  vm.alltype_cout_maitrise = result.data.response; 
                  console.log(vm.alltype_cout_maitrise);
            });

            item.id_zone_subvention  = vm.selectedItem.zone_subvention.id;
            item.id_acces_zone      = vm.selectedItem.acces_zone.id ;
            item.id_type_batiment  = vm.selectedItem.type_batiment.id;
            item.id_type_cout_maitrise      = vm.selectedItem.type_cout_maitrise.id ;
            item.id_type_cout_sousprojet = vm.selectedItem.type_cout_sousprojet.id;
            item.id_type_latrine = vm.selectedItem.type_latrine.id ;
            item.id_type_mobilier = vm.selectedItem.type_mobilier.id ;

            item.nbr_salle    = vm.selectedItem.type_batiment.nbr_salle ;
            item.cout_batiment   = vm.selectedItem.type_batiment.cout_batiment ;

            item.nbr_box = vm.selectedItem.type_latrine.nbr_box_latrine;
            item.cout_latrine    = vm.selectedItem.type_latrine.cout_latrine;

            item.nbr_banc  = vm.selectedItem.type_mobilier.nbr_table_banc ;
            item.cout_mobilier    = vm.selectedItem.type_mobilier.cout_mobilier ;

            item.cout_maitrise   = vm.selectedItem.type_cout_maitrise.cout_maitrise ;
            item.cout_sousprojet = vm.selectedItem.type_cout_sousprojet.cout_sousprojet; 
        };

        //fonction bouton suppression item subvention_initial
        vm.supprimer = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet ensubvention_initialistrement ?')
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

        //function teste s'il existe une modification item subvention_initial
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allsubvention_initial.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].id_type_batiment!=currentItem.id_type_batiment)
                    || (cis[0].id_type_cout_maitrise!=currentItem.id_type_cout_maitrise)
                    || (cis[0].id_type_cout_sousprojet!=currentItem.id_type_cout_sousprojet)
                    || (cis[0].id_type_mobilier!=currentItem.id_type_mobilier)
                    ||(cis[0].id_type_latrine!=currentItem.id_type_latrine)
                    || (cis[0].id_zone_subvention!=currentItem.id_zone_subvention)
                    ||(cis[0].id_acces_zone!=currentItem.id_acces_zone))                    
                      { 
                        if (item.id_zone_subvention!=currentItem.zone_subvention.id || item.id_acces_zone!=currentItem.acces_zone.id )
                        {
                          var sub = vm.allsubvention_initial.filter(function(obj)
                          {
                             return obj.zone_subvention.id == item.id_zone_subvention && obj.acces_zone.id == item.id_acces_zone;
                          });
                          if (sub.length!=0)
                          {
                            vm.showAlert('Ajout refuser','Donnée en doublon');
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

        //insertion ou mise a jours ou suppression item dans bdd subvention_initial
        function insert_in_base(subvention_initial,suppression)
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
                    id_type_cout_maitrise:    subvention_initial.id_type_cout_maitrise,
                    id_type_cout_sousprojet:   subvention_initial.id_type_cout_sousprojet,
                    id_type_batiment:  subvention_initial.id_type_batiment,
                    id_type_latrine: subvention_initial.id_type_latrine,
                    id_type_mobilier: subvention_initial.id_type_mobilier, 
                    id_zone_subvention: subvention_initial.id_zone_subvention,
                    id_acces_zone: subvention_initial.id_acces_zone                
                });
                //console.log(subvention_initial.pays_id);
                //factory
            apiFactory.add("subvention_initial/index",datas, config).success(function (data)
            {
                var zone = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_zone_subvention;
                });

                var acces = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_acces_zone;
                });
                var tbat = vm.alltype_batiment.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_type_batiment;
                });

                var tlat = vm.alltype_latrine.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_type_latrine;
                });

                var tmob = vm.alltype_mobilier.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_type_mobilier;
                });


                var tmait = vm.alltype_cout_maitrise.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_type_cout_maitrise;
                });


                var tsouspro = vm.alltype_cout_sousprojet.filter(function(obj)
                {
                    return obj.id == subvention_initial.id_type_cout_sousprojet;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItem.zone_subvention   = zone[0];
                        vm.selectedItem.acces_zone  = acces[0];
                        vm.selectedItem.type_cout_maitrise   = tmait[0];
                        vm.selectedItem.type_cout_sousprojet  = tsouspro[0];
                        vm.selectedItem.type_latrine   = tlat[0];
                        vm.selectedItem.type_mobilier   = tmob[0];
                        vm.selectedItem.type_batiment       = tbat[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allsubvention_initial = vm.allsubvention_initial.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                      vm.showboutonnouv=true;
                    }
                }
                else
                {
                  subvention_initial.zone_subvention  =  zone[0];
                  subvention_initial.acces_zone =  acces[0];
                  subvention_initial.type_cout_maitrise  =  tmait[0];
                  subvention_initial.type_cout_sousprojet =  tsouspro[0];
                  subvention_initial.type_latrine = tlat[0];
                  subvention_initial.type_mobilier = tmob[0];
                  subvention_initial.type_batiment   = tbat[0];
                  subvention_initial.id        =   String(data.response);              
                  NouvelItem = false;
                  vm.showboutonnouv=false;
            }
              subvention_initial.$selected = false;
              subvention_initial.$edit = false;
              vm.selectedItem = {};
            console.log(vm.allsubvention_initial);
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.change_zone_zubvention = function(item)
        {
          item.id_acces_zone = null;
          item.id_type_batiment = null;
          item.id_type_latrine = null;
          item.id_type_mobilier = null;
          item.id_type_cout_maitrise = null;
          item.id_type_cout_sousprojet = null;
          
        }
        vm.change_acces_zone = function(item)
        {
          item.id_type_latrine = null;
          item.id_type_batiment = null;
          item.id_type_mobilier = null;
          item.id_type_cout_maitrise = null;
          item.id_type_cout_sousprojet = null;
          if (item.id_acces_zone!=null)
          { 
              apiFactory.getAPIgeneraliserREST("type_batiment/index",'menu','getbatimentByZone','id_zone_subvention',item.id_zone_subvention,'id_acces_zone',item.id_acces_zone).then(function(result)
              {
                    vm.alltype_batiment = result.data.response; 
                    console.log(vm.alltype_batiment);
              });
              apiFactory.getAPIgeneraliserREST("type_latrine/index",'menu','getByZone','id_zone_subvention',item.id_zone_subvention,'id_acces_zone',item.id_acces_zone).then(function(result)
              {
                    vm.alltype_latrine = result.data.response; 
                    console.log(vm.alltype_latrine);
              });
              apiFactory.getAPIgeneraliserREST("type_mobilier/index",'menu','getByZone','id_zone_subvention',item.id_zone_subvention,'id_acces_zone',item.id_acces_zone).then(function(result)
              {
                    vm.alltype_mobilier = result.data.response; 
                    console.log(vm.alltype_mobilier);
              });
              apiFactory.getAPIgeneraliserREST("type_cout_sousprojet/index",'menu','getByZone','id_zone_subvention',item.id_zone_subvention,'id_acces_zone',item.id_acces_zone).then(function(result)
              {
                    vm.alltype_cout_sousprojet = result.data.response; 
                    console.log(vm.alltype_cout_sousprojet);
              });
              apiFactory.getAPIgeneraliserREST("type_cout_maitrise/index",'menu','getByZone','id_zone_subvention',item.id_zone_subvention,'id_acces_zone',item.id_acces_zone).then(function(result)
              {
                    vm.alltype_cout_maitrise = result.data.response; 
                    console.log(vm.alltype_cout_maitrise);
              });
            
            
          }
          
        }
        vm.change_type_batiment = function(item)
        {
          item.id_type_latrine = null;
          item.id_type_mobilier = null;
          item.id_type_cout_maitrise = null;
          item.id_type_cout_sousprojet = null;
          var type_bati = vm.alltype_batiment.filter(function(obj)
          {
            return obj.id == item.id_type_batiment;
          });
          item.nbr_salle = type_bati[0].nbr_salle;
          item.cout_batiment = type_bati[0].cout_batiment;
          
        }
        vm.change_type_latrine = function(item)
        {
          var type_latr = vm.alltype_latrine.filter(function(obj)
          {
            return obj.id == item.id_type_latrine;
          });
          item.nbr_box = type_latr[0].nbr_box_latrine;
          item.cout_latrine = type_latr[0].cout_latrine;
        }
        vm.change_type_mobilier = function(item)
        {
          var type_mobi = vm.alltype_mobilier.filter(function(obj)
          {
            return obj.id == item.id_type_mobilier;
          });
          item.nbr_banc = type_mobi[0].nbr_table_banc;
          item.cout_mobilier = type_mobi[0].cout_mobilier;
        }
        vm.change_type_cout_maitrise = function(item)
        {
          var type_mait = vm.alltype_cout_maitrise.filter(function(obj)
          {
            return obj.id == item.id_type_cout_maitrise;
          });
          item.cout_maitrise = type_mait[0].cout_maitrise;
        }
        vm.change_type_cout_sousprojet = function(item)
        {
          var type_soup = vm.alltype_cout_sousprojet.filter(function(obj)
          {
            return obj.id == item.id_type_cout_sousprojet;
          });
          item.cout_sousprojet = type_soup[0].cout_sousprojet;
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
