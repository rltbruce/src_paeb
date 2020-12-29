
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.convention_presence_reliquat')
               
        .controller('Convention_presence_reliquatController', Convention_presence_reliquatController);
    /** @ngInject */
    function Convention_presence_reliquatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

        vm.affiche_load =true;

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalidepresence_reliquat').then(function(result)
        {
              vm.allconvention_entete = result.data.response;
              vm.affiche_load =false;
              console.log(vm.allconvention_entete);
        });

        vm.actualiser = function()
        {
          vm.affiche_load =true;
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalidepresence_reliquat').then(function(result)
          {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
                console.log(vm.allconvention_entete);
          });
        }

        /***************debut convention cisco/feffi**********/
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
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }];        
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
        };
        $scope.$watch('vm.selectedItemConvention_entete', function()
        {
             if (!vm.allconvention_entete) return;
             vm.allconvention_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_entete.$selected = true;
        });     

  /**********************************************Debut Dossier feffi***************************************************/
    vm.formatMillier = function (nombre) 
    {   //var nbr = nombre.toFixed(0);
      var nbr=parseFloat(nombre);
      var n = nbr.toFixed(2);
      var spl= n.split('.');
      var apre_virgule = spl[1];
      var avan_virgule = spl[0];

        if (typeof avan_virgule != 'undefined' && parseInt(avan_virgule) >= 0) {
            avan_virgule += '';
            var sep = ' ';
            var reg = /(\d+)(\d{3})/;
            while (reg.test(avan_virgule)) {
                avan_virgule = avan_virgule.replace(reg, '$1' + sep + '$2');
            }
            return avan_virgule+","+apre_virgule;
        } else {
            return "0,00";
        }
    }
 
    }
})();
