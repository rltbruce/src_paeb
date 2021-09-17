(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.ecole')
        .controller('EcoleController', EcoleController);
    /** @ngInject */
    function EcoleController($mdDialog, $scope, apiFactory, $state, uiGmapGoogleMapApi)
    {
		    var vm = this;
        vm.ajout = ajout ;
        var NouvelItem=false;
        var currentItem;
        vm.selectedItem = {} ;
        vm.allecole = [] ;

        vm.allfokontany = [] ;
        vm.allcisco = [] ;
        vm.allcommune = [] ;        
        vm.allzap = [] ;

        vm.vuemap = false;
        vm.liste = [] ;
        vm.showwindow = false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false ,
          order:[]         
        };

        //col table
        vm.ecole_column = [
        {titre:"Region"
        },
        {titre:"Cisco"
        },
        {titre:"Commune"
        },
        {titre:"Zap"
        },
        {titre:"Fokontany"
        },
        {titre:"Village"
        },
        {titre:"Code"
        },
        {titre:"Denomination"
        },
        {titre:"Latitude"
        },
        {titre:"Longitude"
        },
        {titre:"Altitude"
        },
        {titre:"Type zone"
        },
        {titre:"Acces zone"
        },
        {titre:"Action"}];
        
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;          
        });
        //recuperation donnée ecole
        /*apiFactory.getAll("ecole/index").then(function(result)
        {
            vm.allecole = result.data.response;
            vm.allecole.forEach(function(item)
            {
              var site = {
                id: item.id,
                coords:{
                  latitude: item.latitude,
                  longitude: item.longitude,
                  lieu: item.lieu,
                  description: item.description,
                  code: item.code,
                  ponderation: item.ponderation,
                }
                
              };
              vm.liste.unshift(site);              
            });
            console.log(vm.liste);
        });*/

        //recuperation donnée zone_subvetention
        apiFactory.getAll("zone_subvention/index").then(function(result)
        {
          vm.allzone_subvention= result.data.response;
        });

        //recuperation donnée acces_zone
        apiFactory.getAll("acces_zone/index").then(function(result)
        {
          vm.allacces_zone= result.data.response;
        });
        vm.showformfiltre = function()
        {
          vm.showfiltre=!vm.showfiltre;          
        }

        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
        vm.filtre_change_region = function(item)
        { 
            vm.filtre.id_cisco = null;
            if (item.id_region != '*')
            {
                apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                {
                    vm.ciscos = result.data.response;
                });
            }
            else
            {
                vm.ciscos = [];
            }
          
        }
        vm.filtre_change_cisco = function(item)
        { vm.filtre.id_commune = null;
            if (item.id_cisco != '*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
              {
                vm.communes = result.data.response;
              });
            }
            else
            {
                vm.communes = [];
            }
          
        }
        vm.filtre_change_commune = function(item)
        { 
            vm.filtre.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index",'menu',"getzap_communeBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
                console.log(vm.zaps);
              });
              
            apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",item.id_commune).then(function(result)
            {
                vm.fokontanys = result.data.response;
            });
            }
            else
            {
                vm.zaps = [];
                vm.fokontanys = [];
            }
          
        }
        vm.recherchefiltre = function(filtre)
        {   vm.affiche_load=true;
            apiFactory.getAPIgeneraliserREST("ecole/index",'menus',
              'getecoleByfiltre','id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap).then(function(result)
              {
                  vm.allecole = result.data.response;
                  vm.affiche_load = false;
                  console.log(vm.allecole);
              });
        }

        //recuperation donnée fokontany

        vm.change_region = function(item)
        {
          apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
          {
                    vm.allcisco = result.data.response;
                    console.log(vm.allcisco );
          });

        }
        vm.change_cisco = function(item)
        {
          apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.id_cisco).then(function(result)
          {
                    vm.allcommune = result.data.response;
                    console.log(vm.allcommune );
          });

        }

        vm.change_commune = function(item)
        {
          apiFactory.getAPIgeneraliserREST("zap/index","cle_etrangere",item.id_commune).then(function(result)
          {
                    vm.allzap = result.data.response;
                    console.log(vm.allzap);
          });
          apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",item.id_commune).then(function(result)
          {
                    vm.allfokontany = result.data.response;
                    console.log(vm.allfokontany);
          });
        }

         

        //Masque de saisi ajout
        vm.ajouter = function ()
        { 
          if (NouvelItem == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',         
              code: '',
              description: '',
              lieu: '',
              id_region: '',
              id_cisco: '',
              id_commune: '',
              id_zap: '',
              id_fokontany: '',         
              latitude: '',
              longitude: '',
              altitude: '',
              id_zone_subvention:'',
              id_acces_zone: ''
            };         
            vm.allecole.unshift(items);
            vm.allecole.forEach(function(cis)
            {
              if(cis.$selected==true)
              {
                vm.selectedItem = cis;
              }
            });

            NouvelItem = true ;
          }else
          {
            vm.showAlert('Ajout ecole','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajout(ecole,suppression)
        {
            if (NouvelItem==false)
            {
                test_existance (ecole,suppression); 
            } 
            else
            {
                insert_in_base(ecole,suppression);
            }
        }

        //fonction de bouton d'annulation ecole
        vm.annuler = function(item)
        {
          if (NouvelItem == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.code      = currentItem.code ;
            item.description = currentItem.description ;
            item.lieu = currentItem.lieu ;
            item.id_region  = currentItem.id_region ;
            item.id_cisco  = currentItem.id_cisco ;
            item.id_commune  = currentItem.id_commune ;
            item.id_zap  = currentItem.id_zap ;
            item.id_fokontany  = currentItem.id_fokontany ;
            item.latitude    = currentItem.latitude ;
            item.longitude   = currentItem.longitude ;
            item.altitude    = currentItem.altitude ;
            item.id_zone_subvention = currentItem.id_zone_subvention;
            item.id_acces_zone    = currentItem.id_acces_zone; 
          }else
          {
            vm.allecole = vm.allecole.filter(function(obj)
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
           // vm.nouvelItem   = item;
           if (item.$edit==false || item.$edit==undefined)
            { 
                currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
            }
           // vm.allecole= [] ;
           //console.log(item); 
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allecole) return;
             vm.allecole.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        //fonction masque de saisie modification item ecole
        vm.modifier = function(item)
        {
            NouvelItem = false ;
            vm.selectedItem = item;
            currentItem = angular.copy(vm.selectedItem);
            $scope.vm.allecole.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;            
            item.code      = vm.selectedItem.code ;
            item.description = vm.selectedItem.description;
            item.lieu = vm.selectedItem.lieu;
            item.id_region  = vm.selectedItem.region.id;
            item.id_cisco  = vm.selectedItem.cisco.id;
            item.id_commune  = vm.selectedItem.commune.id;
            item.id_zap  = vm.selectedItem.zap.id;
            item.id_fokontany  = vm.selectedItem.fokontany.id;
            item.latitude      = vm.selectedItem.latitude ;
            item.longitude = vm.selectedItem.longitude;
            item.altitude  = vm.selectedItem.altitude;
            if (vm.selectedItem.zone_subvention) 
            {
              
            item.id_zone_subvention = vm.selectedItem.zone_subvention.id ;
            }
            if (vm.selectedItem.acces_zone) 
            {
              item.id_acces_zone = vm.selectedItem.acces_zone.id ;
              
            }
            apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.region.id).then(function(result)
            {
                      vm.allcisco = result.data.response;
                      console.log(vm.allcisco );
            });
            apiFactory.getAPIgeneraliserREST("commune/index","id_cisco",item.cisco.id).then(function(result)
            {
                      vm.allcommune = result.data.response;
                      console.log(vm.allcommune );
            });
            apiFactory.getAPIgeneraliserREST("zap/index","cle_etrangere",item.commune.id).then(function(result)
            {
                      vm.allzap = result.data.response;
                      console.log(vm.allzap);
            });
            apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",item.commune.id).then(function(result)
            {
                      vm.allfokontany = result.data.response;
                      console.log(vm.allfokontany);
            });
         
        };

        //fonction bouton suppression item ecole
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

        //function teste s'il existe une modification item ecole
        function test_existance (item,suppression)
        {          
            if (suppression!=1)
            {
               var cis = vm.allecole.filter(function(obj)
                {
                   return obj.id == currentItem.id;
                });
                if(cis[0])
                {
                   if((cis[0].description!=currentItem.description) 
                    || (cis[0].code!=currentItem.code)
                    || (cis[0].lieu!=currentItem.lieu)
                    || (cis[0].id_region!=currentItem.id_region)
                    || (cis[0].id_cisco!=currentItem.id_cisco)
                    || (cis[0].id_zap!=currentItem.id_zap)
                    || (cis[0].id_commune!=currentItem.id_commune)
                    || (cis[0].id_cisco!=currentItem.id_cisco)
                    || (cis[0].id_fokontany!=currentItem.id_fokontany)
                    || (cis[0].latitude!=currentItem.latitude)
                    || (cis[0].longitude!=currentItem.longitude)
                    || (cis[0].altitude!=currentItem.altitude)
                    || (cis[0].id_acces_zone!=currentItem.id_acces_zone)
                    ||(cis[0].id_zone_subvention!=currentItem.id_zone_subvention))                    
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

        //insertion ou mise a jours ou suppression item dans bdd ecole
        function insert_in_base(ecole,suppression)
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
                    code:      ecole.code,
                    lieu:      ecole.lieu,      
                    latitude:    ecole.latitude,
                    longitude:   ecole.longitude,
                    altitude:    ecole.altitude,
                    id_region:  ecole.id_region,
                    id_zap:  ecole.id_zap,
                    id_commune:  ecole.id_commune,
                    id_cisco:  ecole.id_cisco,
                    id_fokontany:  ecole.id_fokontany,
                    description: ecole.description,
                    id_zone_subvention: ecole.id_zone_subvention,
                    id_acces_zone: ecole.id_acces_zone,                
                });
                //console.log(ecole.pays_id);
                //factory
            apiFactory.add("ecole/index",datas, config).success(function (data)
            {
                
                var reg = vm.regions.filter(function(obj)
                {
                    return obj.id == ecole.id_region;
                });
                var foko = vm.allfokontany.filter(function(obj)
                {
                    return obj.id == ecole.id_fokontany;
                });
                var cisc = vm.allcisco.filter(function(obj)
                {
                    return obj.id == ecole.id_cisco;
                });
                var com = vm.allcommune.filter(function(obj)
                {
                    return obj.id == ecole.id_commune;
                });
                var zap = vm.allzap.filter(function(obj)
                {
                    return obj.id == ecole.id_zap;
                });

                var zosub = vm.allzone_subvention.filter(function(obj)
                {
                    return obj.id == ecole.id_zone_subvention;
                });

                var azone = vm.allacces_zone.filter(function(obj)
                {
                    return obj.id == ecole.id_acces_zone;
                });

                if (NouvelItem == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {   
                        vm.selectedItem.region   = reg[0];
                        vm.selectedItem.zap   = zap[0];
                        vm.selectedItem.commune  = com[0];
                        vm.selectedItem.cisco   = cisc[0];
                        vm.selectedItem.zone_subvention   = zosub[0];
                        vm.selectedItem.acces_zone   = azone[0];
                        vm.selectedItem.fokontany       = foko[0];
                        vm.selectedItem.$selected  = false;
                        vm.selectedItem.$edit      = false;
                        vm.selectedItem ={};
                    }
                    else 
                    {    
                      vm.allecole = vm.allecole.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItem.id;
                      });
                    }
                }
                else
                { 
                    ecole.region   = reg[0];
                  ecole.zap   = zap[0];
                  ecole.commune  = com[0];
                  ecole.cisco   = cisc[0];
                  ecole.zone_subvention = zosub[0];
                  ecole.acces_zone = azone[0];
                  ecole.fokontany   = foko[0];
                  ecole.id        =   String(data.response);              
                  NouvelItem = false;
            }
              ecole.$selected = false;
              ecole.$edit = false;
              vm.selectedItem = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.change_zone_subvention = function(item)
        {
          item.id_acces_zone = null;
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
