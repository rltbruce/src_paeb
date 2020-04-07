(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_convention_ufp_daaf.reporting.indicateur')
        .controller('IndicateurController', IndicateurController);
    /** @ngInject */
    function IndicateurController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.allconvention_ufp_daaf = [];
        //vm.usercisco = [];
      /*****fin initialisation*****/

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        apiFactory.getAll("convention_ufp_daaf_entete/index").then(function(result)
          {
            vm.allconvention_ufp_daaf_entete = result.data.response;
          });

        vm.resultatfiltrer = function(item)
        {
          apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getindicateurByconvention","id_convention_ufp_daaf_entete",item.id_convention_entete).then(function(result)
          {
            vm.indicateurs = result.data.response;
            console.log(vm.indicateurs );
          }, function error(result){ alert('something went wrong')});
        }


        vm.exportExcel = function(item)
      {
        vm.affiche_load = true ;
        var repertoire = 'indicateur';
            apiFactory.getAPIgeneraliserREST("excel_indicateur/index","menu","exportindicateurByconvention","id_convention_entete",item.id_convention_entete,"repertoire",repertoire).then(function(result)
          {
            
            vm.status    = result.data.status; 
          
            if(vm.status)
            {
                vm.nom_file = result.data.nom_file;            
                window.location = apiUrlexcel+"indicateur/"+vm.nom_file ;
                vm.affiche_load =false; 

            }else{
                vm.message=result.data.message;
                vm.Alert('Export en excel',vm.message);
                vm.affiche_load =false; 
            }
          });        
      }


      /*****************debut cout divers**************/

      vm.indicateur_column = 
      [        
        {
          titre:"Prevision nombre de salles de classe construites"
        },
        {
          titre:"Nombre de salles de classe construites"
        },
        {
          titre:"Prevision Bénéficiaires directs du programme deconstruction (nombre)"
        },
        {
          titre:"Bénéficiaires directs du programme de construction (nombre)"
        },
        {
          titre:"Prevision Nombre d'Ecoles construites"
        },
        {
          titre:"Nombre d'Ecoles construites"
        },
        {
          titre:"Prévision nombre de box de latrine"
        },
        {
          titre:"Réalisation box de latrine"
        },
        {
          titre:"Prevision Nombre de systèmes de point d'Eau installé"
        },
        {
          titre:"Nombre de système de point d'eau  installé"
        },
        {
          titre:"PREVISION NOMBRE TABLES BANC "
        },
        {
          titre:"REALISATION NOMBRE TABLES BANC "
        },
        {
          titre:"PREVISION NOMBRE TABLES DU MAITRE"
        },
        {
          titre:"REALISATION NOMBRE TABLES DU MAITRE"
        },
        {
          titre:"PREVISION NOMBRE CHAISE DU MAITRE "
        },
        {
          titre:"REALISATION NOMBRE CHAISE DU MAITRE"
        }
      ];

  vm.change_convention = function(item)
  { 
    var convent = vm.allconvention_ufp_daaf_entete.filter(function(obj)
            {
                return obj.id == item.id_convention_entete;
            });
    apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',item.id_convention_entete).then(function(result)
    {
        var convention_ufp_daaf_detail = result.data.response; 
        item.date_signature = convention_ufp_daaf_detail[0].date_signature;               
    });
    item.vague = convent[0].num_vague;
    
  }
      /*****************fin cout divers**************/
    
        vm.Alert = function(titre,content)
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
