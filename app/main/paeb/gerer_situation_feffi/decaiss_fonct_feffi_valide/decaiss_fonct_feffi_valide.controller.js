(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_feffi.decaiss_fonct_feffi_valide')
    //.controller('DialogController', DialogController)
        .controller('Decaiss_fonct_feffi_valideController', Decaiss_fonct_feffi_valideController);
    /** @ngInject */
    function Decaiss_fonct_feffi_valideController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;

        vm.allconvention= [] ; 

        vm.selectedItemConvention = {} ;

        vm.alldecaiss_fonct_feffi_valide = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.myFile = [] ;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

vm.convention_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Avancement"
        }];

/**********************************fin justificatif attachement****************************************/
        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'BCAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }
          if (usercisco.id!=undefined)
          {
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allconvention = result.data.response; 
                console.log(vm.allconvention);
            });
          }
          

        });
        //Masque de saisi ajout       

        //fonction selection item entete convention cisco/feffi
        vm.selectionConvention = function (item)
        {
            vm.selectedItemConvention = item;
            if(item.$selected==false)
            {
              currentItemTete     = JSON.parse(JSON.stringify(vm.selectedItemTete));
            }
            //recuperation donnée convention
           if (vm.selectedItemConvention.id!=0)
            {
              apiFactory.getAPIgeneraliserREST("decaiss_fonct_feffi/index",'menu','getdecaiss_valideByconvention','id_convention',item.id).then(function(result)
              {
                  vm.alldecaiss_fonct_feffi_valide = result.data.response;
                  console.log(vm.alldecaiss_fonct_feffi_valide);
              });
              
              //Fin Récupération cout divers par convention
              vm.stepOne = true;
              vm.stepTwo = false;
            };           

        };
        $scope.$watch('vm.selectedItemConvention', function()
        {
             if (!vm.allconvention) return;
             vm.allconvention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention.$selected = true;
        });

        //fonction masque de saisie modification item feffi
       

/**********************************fin justificatif batiment****************************************/

/**********************************fin mpe_sousmissionnaire****************************************/
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

        function convertionDate(daty)
        {   
          if(daty)
            {
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                if(jour <10)
                {
                    jour = '0' + jour;
                }
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

      vm.affichageDate = function (daty)
      {   
        if(daty)
        {
            var date     = new Date(daty);
            var jour  = date.getDate();
            var mois  = date.getMonth()+1;
            var annee = date.getFullYear();
            if(mois <10)
            {
                mois = '0' + mois;
            }
            if(jour <10)
            {
                jour = '0' + jour;
            }
            var date_final= jour+"/"+mois+"/"+annee;
            return date_final
        }      
      }
    }
  
})();
