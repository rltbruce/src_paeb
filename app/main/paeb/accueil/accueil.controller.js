(function ()
{
    'use strict';

    angular
        .module('app.paeb.accueil')
        .controller('AccueilController', AccueilController);

    /** @ngInject */
    function AccueilController($cookieStore,apiFactory,$scope)
    {
        var vm = this; 
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;       
          vm.showracourci_obcaf = false;
          vm.showracourci_bcaf  = false;
          vm.showracourci_aac = false;
          var id_user = $cookieStore.get('id');
          vm.showracourcie=false;
        if (id_user > 0) 
        {

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
            {
                  var utilisateur = result.data.response;
                  //console.log(utilisateur);
                  if (utilisateur.roles.indexOf("ADMIN")!= -1)
                  {
                    vm.showracourci_dpfi = true;
                    //vm.showracourci_bcaf  = true;
                    vm.showracourci_aac = true; 
                    vm.showracourcie=true;
                  }

                  if (utilisateur.roles.indexOf("AAC")!= -1)
                  {
                    vm.showracourci_aac = true;
                    vm.showracourcie=true;
                  }
                  if (utilisateur.roles.indexOf("DPFI")!= -1)
                  {
                    vm.showracourci_dpfi = true;
                    vm.showracourcie=true;
                  }

                 /* if (utilisateur.roles.indexOf("OBCAF")!= -1)
                  {
                    vm.showracourci_obcaf = true;
                  }
                  
                  if (utilisateur.roles.indexOf("BCAF")!= -1)
                  {
                    vm.showracourci_obcaf = true; 
                  }  */              

             });
        }
        vm.convention_entete_column = [
          {titre:"CISCO"
          },
          {titre:"FEFFI"
          },
          {titre:"Code sous projet site"
          },
          {titre:"Accés site"
          },
          {titre:"Référence convention"
          },
          {titre:"Objet"
          },
          {titre:"Référence Financement"
          },
          {titre:"Cout éstimé"
          },
          /*{titre:"Avancement"
          },*/
          {titre:"Utilisateur"
          }];

          vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: false          
          };
          apiFactory.getAll("region/index").then(function success(response)
              {
                  vm.regions = response.data.response;
              });
          vm.recherchefiltre = function(filtre)
        {          
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
            });              

        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
        $scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedDirection: 'right'
      };
      vm.click_menu = function()
      {
        //$scope.isOpen =!$scope.isOpen;
      }
        vm.filtre_change_region = function(item)
          { 
              vm.filtre.id_cisco = null;
              if (item.id_region != '*')
              {
                  apiFactory.getAPIgeneraliserREST("cisco/index","id_region",item.id_region).then(function(result)
                  {
                      vm.ciscos = result.data.response;
                      console.log(vm.ciscos);
                  }, function error(result){ alert('something went wrong')});
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
                  console.log(vm.communes);
                }, function error(result){ alert('something went wrong')});
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
                  apiFactory.getAPIgeneraliserREST("zap_commune/index","menu","getzapBycommune","id_commune",item.id_commune).then(function(result)
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
          vm.filtre_change_ecole = function(item)
          { 
              vm.filtre.id_convention_entete_entete = null;
              if (item.id_ecole != '*')
              {
                    apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index","menu","getconventionByecole","id_ecole",item.id_ecole).then(function(result)
                    {
                      vm.convention_cisco_feffi_entetes = result.data.response;
                      console.log(vm.convention_cisco_feffi_entetes );
                    }, function error(result){ alert('something went wrong')});
              }
          }
          vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
            $scope.demo.isOpen = true;
        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
             //$scope.demo.isOpen = true;
        });
    }
})();
