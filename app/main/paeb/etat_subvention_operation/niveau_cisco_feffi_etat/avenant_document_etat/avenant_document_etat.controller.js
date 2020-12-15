
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_operation.niveau_cisco_feffi_etat.avenant_document_etat')
        .directive('customOnChangefeffi', function($mdDialog) {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChangefeffi);
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
                    scope.document_feffi_scan.fichier = null;
                  }, function() {
                    //alert('rien');
                  });
            }
            else
            {                
                ngModel.$setViewValue(files);
                scope.document_feffi_scan.fichier = files[0].name;
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
        .controller('Avenant_document_etatController', Avenant_document_etatController);
    /** @ngInject */
    function Avenant_document_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.styleTabfils = "acc_sous_menu";
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;
        vm.header_ref_convention = null;
        vm.header_cisco = null;
        vm.header_feffi = null;
        vm.header_class = null;

        vm.affiche_load =false;

/*******************************Debut initialisation suivi financement feffi******************************/
        

        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;

        vm.validation = 0;

        vm.roles = [];
        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonNouvavenant_convention=true;      

/*******************************Fin initialisation suivi financement feffi******************************/   

        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
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
        var id_user = $cookieStore.get('id');
         apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
              vm.roles = result.data.response.roles;              
              var utilisateur = result.data.response;
            if (utilisateur.roles.indexOf("AAC")!= -1)
            {
                vm.showbuttonNeauveaudemandefeffi=true;                            
                vm.session = 'AAC';
            }
            if (utilisateur.roles.indexOf("ADMIN")!= -1)
            {
                vm.showbuttonNeauveaudemandefeffi=true;                            
                vm.session = 'ADMIN';
            }                 

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
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
        {titre:"Utilisateur"
        }];        

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
                                        
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
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
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvContrat_prestataire=true;
           
            vm.stepOne=true;

            vm.header_ref_convention = item.ref_convention;
            vm.header_cisco = item.cisco.code;
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
        vm.step_importerdocument_feffi= function ()
        {vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocumentvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.alldocument_feffi_scan = result.data.response; 
                    vm.affiche_load = false;                                       
                });
        
        }       

  /**********************************************Debut Dossier feffi***************************************************/
    //vm.myFile = [];
     $scope.uploadFile_doc_feffi = function(event)
       {
          var files = event.target.files;
          vm.myFile = files;
        } 

        

        //fonction selection item justificatif batiment
        vm.selectionDocument_feffi_scan= function (item)
        {
            vm.selectedItemDocument_feffi_scan = item;
            vm.validation_document_feffi_scan = item.validation;
            
        };
        $scope.$watch('vm.selectedItemDocument_feffi_scan', function()
        {
             if (!vm.alldocument_feffi_scan) return;
             vm.alldocument_feffi_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_feffi_scan.$selected = true;
        });       
        
        vm.download_document_feffi_scan = function(item)
        {
            window.open(apiUrlFile+item.fichier);
        }
       
    /******************************************debut dossier feffi***********************************************/ 

    /*******************************************debut importer avenant*************************************************/
        
        vm.affichageformimporter_avenant_conv = function()
        {
          vm.showbuttonimporter_avenant_conv =false;
          vm.showformimporter_avenant_conv =true;
        }
        
        $scope.uploadFile_avenant_conv = function(event)
       {
         // console.dir(event);
          var files = event.target.files;
          vm.myFile_avenant_conv = files;
        }
    /*******************************************fin importer avenant***************************************************/

    /*********************************************fin avenant convention***********************************************/
        vm.step_avenant_feffi= function ()
        {   
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.allavenant_convention = result.data.response;
                vm.showbuttonNouvavenant_convention=true;
                vm.affiche_load = false;                                    
            }); 
        
        }
//col table
        vm.avenant_convention_column = [
        {titre:"Référence avenant"
        },
        {titre:"Description"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        }];

        //fonction selection item region
        vm.selectionAvenant_convention= function (item)
        {
            vm.selectedItemAvenant_convention = item;
                vm.validation_avenant_convention = item.validation;
             
            
        };
        $scope.$watch('vm.selectedItemAvenant_convention', function()
        {
             if (!vm.allavenant_convention) return;
             vm.allavenant_convention.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemAvenant_convention.$selected = true;
        });
  /**********************************************Avenant convention***************************************************/

  /******************************************fin maitrise d'oeuvre*******************************************************/
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
            var date_final = null;  
            if(daty!='Invalid Date' && daty!='' && daty!=null)
            {
                console.log(daty);
                var date     = new Date(daty);
                var jour  = date.getDate();
                var mois  = date.getMonth()+1;
                var annee = date.getFullYear();
                if(mois <10)
                {
                    mois = '0' + mois;
                }
                date_final= annee+"-"+mois+"-"+jour;
            }
            return date_final;      
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
        vm.injectDateinInput = function (daty)
        { 
            if (daty!=null && daty!= '') 
            {
                return new Date(daty);
            }
            else
            {
                return null;
            }            

        }
        vm.affichage_sexe= function (sexe)
        { var affiche='';
          switch (sexe)
          {
            case '1':
                affiche= 'Masculin';
                break;
            case '2':
                affiche= 'Feminin';
                break;
            default:
          }
          return affiche;
        };
        
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
