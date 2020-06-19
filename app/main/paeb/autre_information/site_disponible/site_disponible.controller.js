
(function ()
{
    'use strict';

    angular
        .module('app.paeb.autre_information.site_disponible')       
        .controller('Site_disponibleController', Site_disponibleController);
    /** @ngInject */
    function Site_disponibleController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http)
    {
		var vm = this;
        vm.selectedItem = {} ;
        vm.allsite = [] ;
        vm.allclassification_site =[];
        vm.allagence_acc =[];
        vm.regions =[];
        vm.ciscos =[];
        vm.communes =[];
        vm.zaps =[];

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          //autoWidth:true,          
          columnDefs: [{width: '50%', targets: 0}]         
        };

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=false;
          vm.showfiltre=true;
        }
        //col table
        vm.site_column = [
        {titre:"Region"
        },
        {titre:"Cisco"
        },
        {titre:"Commune"
        },
        {titre:"Zap"
        },
        {titre:"Epp"
        },
        {titre:"Code sous projet"
        },
        {titre:"objet sous projet"
        },
        {titre:"Classification site"
        },
        {titre:"Lot"
        },
        {titre:"Agence d'accompagnemant"
        },
        {titre:"Statut"
        },
        {titre:"Observation"
        },
        {titre:"Action"}];
        

        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        });
 

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
                apiFactory.getAPIgeneraliserREST("zap_commune/index","getzap_communeBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.filtre_change_zap = function(item)
        { 
            vm.filtre.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.ecoles = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }

        vm.recherchefiltre = function(filtre)
        {
            apiFactory.getAPIgeneraliserREST("site/index",'menu',
              'getsite_disponible','id_region',filtre.id_region,'id_cisco',
              filtre.id_cisco,'id_commune',filtre.id_commune,'id_zap',filtre.id_zap,'id_ecole',filtre.id_ecole).then(function(result)
              {
                  vm.allsite = result.data.response;
              });
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showbuttonfiltre=true;
            vm.showfiltre=false;
        }

        vm.change_region = function(item)
        {            
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
        vm.change_cisco = function(item)
        { item.id_commune = null;
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
        vm.change_commune = function(item)
        { 
            item.id_zap = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("zap_commune/index",'menu',"getzap_communeBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.zaps = result.data.response;
              });
            }
            else
            {
                vm.zaps = [];
            }
          
        }
        vm.change_zap = function(item)
        { 
            item.id_ecole = null;
            if (item.id_zap != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleByzap","id_zap",item.id_zap).then(function(result)
              {
                vm.allecole = result.data.response;
              });
            }
            else
            {
                vm.ecoles = [];
            }
          
        }

        //fonction selection item region
        vm.selection= function (item)
        {
            vm.selectedItem = item;
        };
        $scope.$watch('vm.selectedItem', function()
        {
             if (!vm.allsite) return;
             vm.allsite.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItem.$selected = true;
        });

        vm.affichestatuconvention = function(item)
        {
          var x = Number(item);
          switch(x)
          {
              case 1:
              {
                  return "En cours de traitement";
                  break;
              }

              case 2:
              {
                  return "Signé";
                  break;
              }

              default:
              {
                  return "Preparation";
                  break;
              }
          }
        }
        vm.affichelot = function(item)
        {
          var x = Number(item);
          switch(x)
          {
              case 1:
              {
                  return "Lot 1";
                  break;
              }

              case 2:
              {
                  return "Lot 2";
                  break;
              }

              case 3:
              {
                  return "Lot 3";
                  break;
              }

              default:
              {
                  return "Lot 4";
                  break;
              }
          }
        }
    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
