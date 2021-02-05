
(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_cisco_feffi.validation_avenant_document')
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
        .controller('Validation_avenant_documentController', Validation_avenant_documentController);
    /** @ngInject */
    function Validation_avenant_documentController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
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
        
        vm.ajoutDocument_feffi_scan = ajoutDocument_feffi_scan;
        var NouvelItemDocument_feffi_scan=false;
        var currentItemDocument_feffi_scan;
        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;
      vm.showbuttonValidation_document_feffi_scan  = false;

        vm.validation = 0;

        vm.allcompte_feffi = [];
        vm.roles = [];

        vm.nbr_demande_feffi_creer=0;

        vm.showbuttonValidation = false;
        vm.ajoutAvenant_convention = ajoutAvenant_convention ;
        var NouvelItemAvenant_convention=false;
        var currentItemAvenant_convention;
        vm.selectedItemAvenant_convention = {} ;
        vm.allavenant_convention = [] ;

        vm.showbuttonValidation_avenant_convention = false;   

/*******************************Fin initialisation suivi financement feffi******************************/
/********************************************Debut importer********************************************/ 
        vm.showbuttonimporter_avenant_conv=true;
        vm.showformimporter_avenant_conv = false;
/********************************************Fin importer********************************************/     

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
            //var date_debut = convertionDate(filtre.date_debut);
            //var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
            {
                vm.allconvention_entete = result.data.response;
                vm.affiche_load =false;
            });
            
            /*switch (vm.session)
                {
                  case 'AAC': 
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydateutilisateur','id_utilisateur',id_user,'date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });

                      break;

                  case 'ADMIN':                            
                            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
                                ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete,'id_zap',filtre.id_zap).then(function(result)
                            {
                                vm.allconvention_entete = result.data.response;
                                vm.affiche_load =false;
                            });                 
                      break;
                  default:
                      break;
              
                } */
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
        vm.step_importerdocument_feffi= function ()
        {vm.affiche_load = true;
                apiFactory.getAPIgeneraliserREST("dossier_feffi/index",'menu','getdocumentinvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    vm.alldocument_feffi_scan = result.data.response; 
                    vm.affiche_load = false;                                       
                });
        
        }       

  /**********************************************Debut Dossier feffi***************************************************/
    vm.myFile = [];
     $scope.uploadFile_doc_feffi = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          //vm.selectedItemDocument_feffi_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_feffi_scan.fichier);
        }        

         //fonction ajout dans bdd
        function ajoutDocument_feffi_scan(document_feffi_scan,suppression)
        {
            if (NouvelItemDocument_feffi_scan==false)
            {
                
                apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu',"getdocument_feffi_scanvalideById",'id_document_feffi_scan',document_feffi_scan.id_document_feffi_scan).then(function(result)
                {
                  var document_feffi_scan_valide = result.data.response;
                  if (document_feffi_scan_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé. ')
                    .textContent('Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
                      {
                          return obj.id !== document_feffi_scan.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceDocument_feffi_scan (document_feffi_scan,suppression);         
                  }
                }); 
            } 
            else
            {
                insert_in_baseDocument_feffi_scan(document_feffi_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_feffi_scan
        vm.annulerDocument_feffi_scan = function(item)
        {
          if (NouvelItemDocument_feffi_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_feffi_scan.fichier ;
            item.date_elaboration   = currentItemDocument_feffi_scan.date_elaboration ;
            item.observation   = currentItemDocument_feffi_scan.observation ;
          }else
          {
            /*vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
            {
                return obj.id != vm.selectedItemDocument_feffi_scan.id;
            });*/

            item.fichier   = '';
            item.date_elaboration   = '' ;
            item.observation   = '' ;
            item.$edit = false;
            item.$selected = false;

            item.id_document_feffi_scan = null;
          }

          vm.selectedItemDocument_feffi_scan = {} ;
          NouvelItemDocument_feffi_scan      = false;
          
        };

          //fonction selection item justificatif batiment
        vm.selectionDocument_feffi_scan= function (item)
        {
            vm.selectedItemDocument_feffi_scan = item;
            vm.validation_document_feffi_scan = item.validation;
            if (item.$edit==false || item.$edit==undefined)
            {
                vm.showbuttonValidation_document_feffi_scan = true;
            }
            if(item.$selected==false || item.$selected==undefined)
            {               
                currentItemDocument_feffi_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_feffi_scan)); 
            }
            
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

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_feffi_scan = function(item)
        {
            
            vm.selectedItemDocument_feffi_scan = item;
            currentItemDocument_feffi_scan = angular.copy(vm.selectedItemDocument_feffi_scan);
            $scope.vm.alldocument_feffi_scan.forEach(function(jus) {
              jus.$edit = false;
            });
            item.$edit = true;
            item.$selected = true;
            if (item.id_document_feffi_scan==null)
            {   
                apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu','getdocumentByconventiondossier_prevu','id_document_feffi',item.id,'id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
                {
                    var document_feffi_scan_valide = result.data.response;
                      if (document_feffi_scan_valide.length !=0)
                      {
                          var confirm = $mdDialog.confirm()
                        .title('cet ajout  n\'est pas autorisé.')
                        .textContent('Ce document existe déjà!')
                        .ariaLabel('Lucky day')
                        .clickOutsideToClose(true)
                        .parent(angular.element(document.body))
                        .ok('Fermer')
                        
                        $mdDialog.show(confirm).then(function()
                        {                         
                            item.$edit = false;
                            item.$selected = false;
                        }, function() {
                          //alert('rien');
                        });
                      }
                      else
                      { 
                        NouvelItemDocument_feffi_scan=true;
                        console.log('atonull');
                        item.fichier   = vm.selectedItemDocument_feffi_scan.fichier ;
                        item.date_elaboration   = vm.datenow ;
                        item.observation   = vm.selectedItemDocument_feffi_scan.observation ;
                        item.id_document_feffi_scan   = '0' ;
                        item.id_convention_entete   = vm.selectedItemConvention_entete.id ;
                    }
                });

            }
            else
            {NouvelItemDocument_feffi_scan = false ;
                console.log('tsnull');
                item.fichier   = vm.selectedItemDocument_feffi_scan.fichier ;
                item.date_elaboration   = vm.injectDateinInput(vm.selectedItemDocument_feffi_scan.date_elaboration) ;
                item.observation   = vm.selectedItemDocument_feffi_scan.observation ;
            }
            vm.showbuttonValidation_document_feffi_scan = false;
            
            
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_feffi_scan
        vm.supprimerDocument_feffi_scan = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutDocument_feffi_scan(vm.selectedItemDocument_feffi_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_feffi_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_feffi_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_feffi_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_feffi_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_feffi_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_feffi_scan.observation ))                   
                      { 
                         insert_in_baseDocument_feffi_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_feffi_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_feffi_scan
        function insert_in_baseDocument_feffi_scan(document_feffi_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_feffi_scan==false)
            {
                getId = vm.selectedItemDocument_feffi_scan.id_document_feffi_scan; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    id_document_feffi: document_feffi_scan.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {

              if (NouvelItemDocument_feffi_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         //;
                    
                          var repertoire = 'document_feffi_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_feffi_scan.id_document_feffi_scan;
                                              
                          if(vm.myFile.length>0)
                          { 
                            var file= vm.myFile[0]
                            var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

                            var fd = new FormData();
                            fd.append('file', file);
                            fd.append('repertoire',repertoire);
                            fd.append('name_fichier',name_file);

                            var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}, repertoire: repertoire
                            }).success(function(data)
                            {
                                if(data['erreur'])
                                {
                                  var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                                 
                                  var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                                  $mdDialog.show( alert ).finally(function()
                                  { 
                                    document_feffi_scan.fichier='';                                    
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_feffi_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_feffi_scan.date_elaboration),
                                                      observation: currentItemDocument_feffi_scan.observation,
                                                      id_convention_entete: vm.selectedItemConvention_entete.id,
                                                      id_document_feffi: currentItemDocument_feffi_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_feffi_scan.$selected = false;
                                          document_feffi_scan.$edit = false;
                                          document_feffi_scan.fichier=currentItemDocument_feffi_scan.fichier;
                                          document_feffi_scan.date_elaboration=currentItemDocument_feffi_scan.date_elaboration;
                                          document_feffi_scan.observation=currentItemDocument_feffi_scan.observation;
                                          vm.selectedItemDocument_feffi_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_feffi_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_feffi_scan.fichier,
                                        date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                                        observation: document_feffi_scan.observation,
                                        id_convention_entete: vm.selectedItemConvention_entete.id,
                                        id_document_feffi: document_feffi_scan.id,
                                        validation:0               
                                    });
                                  console.log(document_feffi_scan);
                                  apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_feffi_scan.$selected = false;
                                      document_feffi_scan.$edit = false;
                                      vm.selectedItemDocument_feffi_scan = {};
                                      console.log('e');
                                  }).error(function (data)
                                    {
                                        vm.showAlert('Error','Erreur lors de l\'insertion de donnée');

                                    });
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                              var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: currentItemDocument_feffi_scan.fichier,
                                                      date_elaboration: convertionDate(currentItemDocument_feffi_scan.date_elaboration),
                                                      observation: currentItemDocument_feffi_scan.observation,
                                                      id_convention_entete: vm.selectedItemConvention_entete.id,
                                                      id_document_feffi: currentItemDocument_feffi_scan.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                      {                                           
                                            
                                          document_feffi_scan.$selected = false;
                                          document_feffi_scan.$edit = false;
                                          document_feffi_scan.fichier=currentItemDocument_feffi_scan.fichier;
                                          document_feffi_scan.date_elaboration=currentItemDocument_feffi_scan.date_elaboration;
                                          document_feffi_scan.observation=currentItemDocument_feffi_scan.observation;
                                          vm.selectedItemDocument_feffi_scan = {};
                                      console.log('erreurmod_talou');
                                      });
                            });
                          }
                        //vm.selectedItemDocument_feffi_scan.document_feffi = doc[0];
                       // vm.selectedItemDocument_feffi_scan.contrat_feffi = vm.selectedItemContrat_feffi ;
                        vm.selectedItemDocument_feffi_scan.$selected  = false;
                        vm.selectedItemDocument_feffi_scan.$edit      = false;
                        vm.selectedItemDocument_feffi_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                     /* vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_feffi_scan.id;
                      });*/
                      vm.selectedItemDocument_feffi_scan.existance = true;
                      var chemin= vm.selectedItemDocument_feffi_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {                         
                          vm.selectedItemDocument_feffi_scan.fichier = '';
                          vm.selectedItemDocument_feffi_scan.date_elaboration = '';
                          vm.selectedItemDocument_feffi_scan.observation = '';
                          vm.selectedItemDocument_feffi_scan.existance = false;

                          vm.selectedItemDocument_feffi_scan.id_document_feffi_scan = null;
                      }).error(function()
                      {
                          showAlert(event,chemin);
                      });;
                    }
              }
              else
              {
                  document_feffi_scan.id_document_feffi_scan  =   String(data.response);              
                  NouvelItemDocument_feffi_scan = false;

                    
                    
                    var repertoire = 'document_feffi_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(vm.myFile.length>0)
                    { 
                        var file= vm.myFile[0];
                      var name_file = vm.selectedItemConvention_entete.ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

                      var fd = new FormData();
                      fd.append('file', file);
                      fd.append('repertoire',repertoire);
                      fd.append('name_fichier',name_file);

                      var upl= $http.post(uploadUrl, fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, repertoire: repertoire
                      }).success(function(data)
                      {
                          if(data['erreur'])
                          {
                            var msg = data['erreur'].error.replace(/<[^>]*>/g, '');
                           
                            var alert = $mdDialog.alert({title: 'Notification',textContent: msg,ok: 'Fermé'});                  
                            $mdDialog.show( alert ).finally(function()
                            { 
                              document_feffi_scan.fichier='';
                            var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_feffi_scan.fichier,
                                                date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                                                observation: document_feffi_scan.observation,
                                                id_convention_entete: vm.selectedItemConvention_entete.id,
                                                id_document_feffi: document_feffi_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                {
                                    document_feffi_scan.$selected = false;
                                    document_feffi_scan.$edit = false;
                                    document_feffi_scan.validation = null;
                                    document_feffi_scan.date_elaboration = null;
                                    document_feffi_scan.observation = null;
                                    document_feffi_scan.id_document_feffi_scan = null;
                                    vm.selectedItemDocument_feffi_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_feffi_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_feffi_scan.fichier,
                                  date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                                  observation: document_feffi_scan.observation,
                                  id_convention_entete: vm.selectedItemConvention_entete.id,
                                  id_document_feffi: document_feffi_scan.id,
                                  validation:0               
                              });

                            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                            {   
                                vm.validation_document_feffi_scan = 0;
                                document_feffi_scan.validation = 0;
                                document_feffi_scan.existance =true;  
                                document_feffi_scan.$selected = false;
                                document_feffi_scan.$edit = false;
                                vm.selectedItemDocument_feffi_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                        var datas = $.param({
                                                supprimer: 1,
                                                id:        getIdFile,
                                                fichier: document_feffi_scan.fichier,
                                                date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                                                observation: document_feffi_scan.observation,
                                                id_convention_entete: vm.selectedItemConvention_entete.id,
                                                id_document_feffi: document_feffi_scan.id,
                                                validation:0
                                  });
                                apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                { 
                                    document_feffi_scan.$selected = false;
                                    document_feffi_scan.$edit = false;
                                    document_feffi_scan.validation = null;
                                    document_feffi_scan.fichier = null;
                                    document_feffi_scan.date_elaboration = null;
                                    document_feffi_scan.observation = null;
                                    document_feffi_scan.id_document_feffi_scan = null;
                                    vm.selectedItemDocument_feffi_scan = {};
                                console.log('ajout_suppr');
                                });
                      });
                    }
              }
              //document_feffi_scan.document_feffi = doc[0];
              document_feffi_scan.convention_entete = vm.selectedItemConvention_entete ;
              document_feffi_scan.$selected = false;
              document_feffi_scan.$edit = false;
              //vm.selectedItemDocument_feffi_scan = {};
             
              vm.showbuttonValidation_document_feffi_scan = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
        vm.validerDocument_feffi_scan = function()
        {
          maj_in_baseDocument_feffi_scan(vm.selectedItemDocument_feffi_scan,0);
        }

                //insertion ou mise a jours ou suppression item dans bdd document_feffi_scan
        function maj_in_baseDocument_feffi_scan(document_feffi_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_feffi_scan.id_document_feffi_scan,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(document_feffi_scan.date_elaboration),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    id_document_feffi: document_feffi_scan.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {   

              /*vm.validation_document_feffi_scan = 1;
              document_feffi_scan.validation=1;*/
              //vm.alldocument_feffi_scan_valide.push(document_feffi_scan);

              vm.showbuttonValidation_document_feffi_scan = false;
                document_feffi_scan.fichier   = null ;
                document_feffi_scan.date_elaboration   = null ;
                document_feffi_scan.observation   = null ;
                document_feffi_scan.id_document_feffi_scan   = null ;
                document_feffi_scan.validation   = null ;
                document_feffi_scan.existance   = false ;
              vm.selectedItemDocument_feffi_scan = {};
              //vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        
        vm.download_document_feffi_scan = function(item)
        {
            window.open(apiUrlFile+item.fichier);
        }

       
    /******************************************debut dossier feffi***********************************************/ 

    /*******************************************debut importer avenant*************************************************/

        vm.step_avenant_feffi= function ()
        {   
            vm.affiche_load = true;
            apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu','getavenantinvalideByconvention','id_convention_entete',vm.selectedItemConvention_entete.id).then(function(result)
            {
                vm.allavenant_convention = result.data.response;
                vm.showbuttonNouvavenant_convention=true;
                vm.affiche_load = false;                                    
            }); 
        
        }
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
        vm.annulerimporter_avenant_conv = function()
        {
            vm.fichier_avenant_conv = {};
            //angular.element("#fichier").$setUntouched();
            vm.showbuttonimporter_avenant_conv=true;
            vm.showformimporter_avenant_conv=false;
            //$scope.uploadFile.$setUntouched();
        }

        vm.importer_avenant_conv = function (item,suppression) {
          vm.affiche_load = true;  
          var file =vm.myFile_avenant_conv[0];
          var repertoire = 'importer_avenant_conv/';
          var uploadUrl = apiUrl + "importer_avenant_conv/importerdonnee_avenant_conv";
          var name = vm.myFile_avenant_conv[0].name;
          var fd = new FormData();
          fd.append('file', file);
          fd.append('repertoire',repertoire);
          fd.append('name_fichier',name);
          if(file) { 
            var upl=   $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).success(function(data){
              vm.fichier_avenant_conv=data["nom_fichier"];
              vm.repertoire_avenant_conv=data["repertoire"];
              if(data.erreur==true)
              {               
               vm.showAlert("Erreur",data.erreur_value);
               
              } else {
                //vm.showAlert("Erreur","Il y a des erreurs dans le fichier à importer.Veuillez clicquer sur ok pour voir les erreurs");
                // Enlever de la liste puisqu'il y a des erreurs : sans sauvegarde dans la BDD
                console.log(data); 
                //vm.showAlert("INFORMATION","Le fichier a été importer avec succés");
                var confirm = $mdDialog.confirm()
                    .title('Nombre de donnée inserée: '+data.nbr_inserer+', Nombre de donnée réfusée: '+data.nbr_refuser)
                    .textContent('Clicquer sur ok pour télécharger le rapport excel')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                  
                  $mdDialog.show(confirm).then(function()
                  {
                    window.location = apiUrlexcel+"importer_avenant_conv/"+data.nomFile;
                    vm.allavenant_convention = data.avenant_conv_inserer;
                    vm.affiche_load = false;
                  }, function() {
                    //alert('rien');
                  });                    
              } 
            }).error(function(){
              // console.log("Rivotra");
            });
          } else {
            vm.showAlert("Information","Aucun fichier");
          }
        }
    /*******************************************fin importer avenant***************************************************/

    /*********************************************fin avenant convention***********************************************/

//col table
        vm.avenant_convention_column = [
        {titre:"Référence avenant"
        },
        {titre:"Description"
        },
        {titre:"Montant"
        },
        {titre:"Date signature"
        },
        {titre:"Action"
        }];


        //fonction ajout dans bdd
        function ajoutAvenant_convention(avenant_convention,suppression)
        {
            if (NouvelItemAvenant_convention==false)
            {                
                apiFactory.getAPIgeneraliserREST("avenant_convention/index",'menu',"getavenant_conventionvalideById",'id_avenant_convention',avenant_convention.id).then(function(result)
                {
                  var avenant_convention_valide = result.data.response;
                  if (avenant_convention_valide.length !=0)
                  {
                      var confirm = $mdDialog.confirm()
                    .title('cette modification n\'est pas autorisé.')
                    .textContent(' Les données sont déjà validées!')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('Fermer')
                    
                    $mdDialog.show(confirm).then(function()
                    {                      
                      vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                      {
                          return obj.id !== avenant_convention.id;
                      });
                    }, function() {
                      //alert('rien');
                    });
                  }
                  else
                  {
                    test_existanceAvenant_convention (avenant_convention,suppression);        
                  }
                }); 
            } 
            else
            {
                insert_in_baseAvenant_convention(avenant_convention,suppression);
            }
        }

        //fonction de bouton d'annulation avenant_convention
        vm.annulerAvenant_convention = function(item)
        {
          if (NouvelItemAvenant_convention == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.ref_avenant   = currentItemAvenant_convention.ref_avenant ;
            item.description   = currentItemAvenant_convention.description ;
            item.montant   = currentItemAvenant_convention.montant ;
            item.date_signature = currentItemAvenant_convention.date_signature ;
          }else
          {
            vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
            {
                return obj.id !== vm.selectedItemAvenant_convention.id;
            });
          }
        
            vm.showbuttonNouvavenant_convention=true;

          vm.selectedItemAvenant_convention = {} ;
          NouvelItemAvenant_convention      = false;
          
        };

        //fonction selection item region
        vm.selectionAvenant_convention= function (item)
        {
            vm.selectedItemAvenant_convention = item;
            //vm.nouvelItemAvenant_convention   = item;
            if (item.$selected == false || item.$selected == undefined)
            {
                currentItemAvenant_convention    = JSON.parse(JSON.stringify(vm.selectedItemAvenant_convention));
            }
             if (item.$edit == false || item.$edit == undefined)
            {
                vm.showbuttonValidation_avenant_convention = true;
            }
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

        //fonction masque de saisie modification item feffi
        vm.modifierAvenant_convention = function(item)
        {
            NouvelItemAvenant_convention = false ;
            vm.selectedItemAvenant_convention = item;
            currentItemAvenant_convention = angular.copy(vm.selectedItemAvenant_convention);
            $scope.vm.allavenant_convention.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.ref_avenant   = vm.selectedItemAvenant_convention.ref_avenant ;
            item.description   = vm.selectedItemAvenant_convention.description ;
            item.montant   = parseFloat(vm.selectedItemAvenant_convention.montant);
            item.date_signature = vm.injectDateinInput(vm.selectedItemAvenant_convention.date_signature) ;
            vm.showbuttonValidation_avenant_convention = false;
        };

        //fonction bouton suppression item Avenant_convention
        vm.supprimerAvenant_convention = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enfeffiistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutAvenant_convention(vm.selectedItemAvenant_convention,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceAvenant_convention (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allavenant_convention.filter(function(obj)
                {
                   return obj.id == currentItemAvenant_convention.id;
                });
                if(pass[0])
                {
                   if((pass[0].description   != currentItemAvenant_convention.description )
                    || (pass[0].montant  != currentItemAvenant_convention.montant)
                    || (pass[0].date_signature != currentItemAvenant_convention.date_signature )
                    || (pass[0].ref_avenant != currentItemAvenant_convention.ref_avenant ))                   
                      { 
                         insert_in_baseAvenant_convention(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseAvenant_convention(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_baseAvenant_convention(avenant_convention,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemAvenant_convention==false)
            {
                getId = vm.selectedItemAvenant_convention.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    ref_avenant: avenant_convention.ref_avenant,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(avenant_convention.date_signature),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {   
                var conve= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == vm.selectedItemConvention_entete.id;
                });

                if (NouvelItemAvenant_convention == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {                        
                        //vm.selectedItemAvenant_convention.convention = conve[0];
                        
                        vm.selectedItemAvenant_convention.$selected  = false;
                        vm.selectedItemAvenant_convention.$edit      = false;
                        vm.selectedItemAvenant_convention ={};
                    }
                    else 
                    {    
                      vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemAvenant_convention.id;
                      });
                    
                    }
                }
                else
                {
                  //avenant_convention.convention = conve[0];
                  avenant_convention.validation =0
                  avenant_convention.id  =   String(data.response);              
                  NouvelItemAvenant_convention=false;
                }
              vm.validation_avenant_convention = 0
              avenant_convention.$selected = false;
              avenant_convention.$edit = false;
              vm.selectedItemAvenant_convention = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerAvenant_convention = function()
        {
          valideravenantinbase(vm.selectedItemAvenant_convention,0,1);
        }
        function valideravenantinbase(avenant_convention,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        avenant_convention.id,
                    ref_avenant: avenant_convention.ref_avenant,
                    description: avenant_convention.description,
                    montant: avenant_convention.montant,
                    date_signature:convertionDate(avenant_convention.date_signature),
                    date_signature:convertionDate(avenant_convention.date_signature),
                    id_convention_entete: vm.selectedItemConvention_entete.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("avenant_convention/index",datas, config).success(function (data)
            {
               /* avenant_convention.validation = validation;
                vm.validation_avenant_convention = validation;
                avenant_convention.$selected = false;
                avenant_convention.$edit = false;*/
                vm.allavenant_convention = vm.allavenant_convention.filter(function(obj)
                {
                    return obj.id !== avenant_convention.id;
                });
                vm.selectedItemAvenant_convention = {};
                vm.showbuttonValidation_avenant_convention = false;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

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
