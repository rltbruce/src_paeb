(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_feffi_feffi_etat.addition_frais_fonctionnement_etat')
        .directive('customOnChangepieceaddition', function($mdDialog) {
          return {
            restrict: 'A',
            require:'ngModel',
            link: function (scope, element, attrs,ngModel) {
              var onChangeHandler = scope.$eval(attrs.customOnChangepieceaddition);
                element.bind('change', onChangeHandler);
              element.on("change", function(e) {
              var files = element[0].files;
              if((files[0].size/1024/1024)>20)
                {
                    ngModel.$setViewValue(null);
                    var confirm = $mdDialog.confirm()
                        .title('Cet action n\'est pas autorisé')
                        .textContent('La taille doit être inferieur à 20MB')
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('Fermer');
                      
                      $mdDialog.show(confirm).then(function()
                      {
                        ngModel.$setViewValue(null);
                        element.val(null);
                        scope.justificatif_frais_fonction_feffi.fichier = null;
                      }, function() {
                        //alert('rien');
                      });
                }
                else
                {                
                    ngModel.$setViewValue(files);
                    scope.justificatif_frais_fonction_feffi.fichier = files[0].name;
                } 
            });
            }
          };
        })
        .service('fileUpload', ['$http', function ($http) {
          this.uploadFileToUrl = function(file, uploadUrl){
            var fd = new FormData();
            var rep='test';
            fd.append('file', file);
            $http.post(uploadUrl, fd,{
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(){
               console.log('tafa');
            }).error(function(){
               console.log('Rivotra');
            });
          }
        }])         
        .controller('Addition_frais_fonctionnement_etatController', Addition_frais_fonctionnement_etatController)
    /** @ngInject */
    function Addition_frais_fonctionnement_etatController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,$cookieStore,apiUrlFile)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
      
        vm.stepAddition=false;

        vm.session = '';
        vm.ciscos=[];
        vm.affiche_load =false;
        vm.myFile = [];
        
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

/*******************************Debut initialisation suivi financement feffi******************************/ 
        vm.validation = 0;
        vm.roles = [];


        //initialisation decaissement fonctionnement feffi       
        vm.selectedItemAddition_frais_fonctionnement = {} ;
        vm.alladdition_frais_fonctionnement = [] ;  

        vm.selectedItemJustificatif_frais_fonction_feffi = {} ;
        vm.alljustificatif_frais_fonction_feffi = [] ;
        
        vm.steppieceaddition = false;

/*******************************Fin initialisation suivi financement feffi******************************/

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false,
          order: []          
        };

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }

        vm.datenow = new Date();

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
                  }, function error(result){ alert('something went wrong')});
            }
        }
        apiFactory.getAll("region/index").then(function success(response)
        {
            vm.regions = response.data.response;
        });

        
        apiFactory.getAll("rubrique_addition_fonct_feffi/index").then(function success(response)
        {
            vm.allrubrique_addition_fonctionnement = response.data.response;
        });

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
        {titre:"Référence Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }]; 
     

        vm.recherchefiltre = function(filtre)
        {
            //var date_debut = convertionDate(filtre.date_debut);
            //var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
            ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;

            });
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
            vm.stepAddition=true;
            vm.header_ref_convention = item.ref_convention;
              vm.header_cisco = item.cisco.description;
              vm.header_feffi = item.feffi.denomination; 
              vm.header_class = 'headerbig';
                         

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
        
  /**********************************fin decaissement fonctionnement feffi******************************/

        vm.step_menu_addition = function()
        { 
          vm.affiche_load =true;
          apiFactory.getAPIgeneraliserREST("addition_frais_fonctionnement/index",'menu','getaddition_valideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alladdition_frais_fonctionnement = result.data.response;
              console.log(vm.alladdition_frais_fonctionnement);
              vm.affiche_load =false;               
              vm.steppieceaddition = false;
          });
        }
        //Masque de saisi ajout
       
        //fonction selection item justificatif batiment
        vm.selectionAddition_frais_fonctionnement= function (item)
        {
            vm.selectedItemAddition_frais_fonctionnement = item;
            vm.steppieceaddition = true;
            
        };
        $scope.$watch('vm.selectedItemAddition_frais_fonctionnement', function()
        {
             if (!vm.alladdition_frais_fonctionnement) return;
             vm.alladdition_frais_fonctionnement.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAddition_frais_fonctionnement.$selected = true;
        });               

    /*********************************************Fin decaissement feffi************************************************/
  /*********************************************Debut justificatif************************************************/
  vm.step_justificatif = function()
    {
      apiFactory.getAPIgeneraliserREST("piece_justificatif_frais_fonction_feffi/index",'id_addition_frais',vm.selectedItemAddition_frais_fonctionnement.id).then(function(result)
      {
          vm.alljustificatif_frais_fonction_feffi = result.data.response;
          console.log(vm.alljustificatif_frais_fonction_feffi);
      });
    }
        vm.justificatif_frais_fonction_feffi_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];
    vm.selectionJustificatif_frais_fonction_feffi= function (item)
        {
            vm.selectedItemJustificatif_frais_fonction_feffi = item;
        };
        $scope.$watch('vm.selectedItemJustificatif_frais_fonction_feffi', function()
        {
             if (!vm.alljustificatif_frais_fonction_feffi) return;
             vm.alljustificatif_frais_fonction_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_frais_fonction_feffi.$selected = true;
        });

        vm.download_justificatif = function(item)
        {
           window.open(apiUrlFile+item.fichier);
        }
    /*********************************************Fin justificatif************************************************/

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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }
        //format date affichage sur datatable
        vm.formatDate = function (daty)
        {
          if (daty) 
          {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
          }            

        }        

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
