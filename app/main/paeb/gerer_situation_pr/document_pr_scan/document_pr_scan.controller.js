(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_pr.document_pr_scan')
        .directive('customOnChange', function() {
      return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs,ngModel) {
          var onChangeHandler = scope.$eval(attrs.customOnChange);
          element.bind('change', onChangeHandler);
          element.on("change", function(e) {
          var files = element[0].files;
          ngModel.$setViewValue(files);
        })
        }
      };
    })
        .directive('fileModel', ['$parse', function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;        
          element.bind('change', function(){
            scope.$apply(function(){
              //modelSetter(scope, element[0].files[0]);
               //console.log(element[0].files[0]);

            });
          });
        }
      };
    }])
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
    //.controller('DialogController', DialogController)
        .controller('Document_pr_scanController', Document_pr_scanController);
    /** @ngInject */
    function Document_pr_scanController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;

        vm.selectedItemContrat_partenaire_relai = {} ;
        vm.allcontrat_partenaire_relai = [] ;        

        //initialisation convention_cisco_feffi_entete
        vm.selectedItemConvention_cisco_feffi_entete = {} ;
        vm.allconvention_cisco_feffi_entete  = [] ;

        vm.ajoutDocument_pr_scan = ajoutDocument_pr_scan;
        var NouvelItemDocument_pr_scan=false;
        var currentItemDocument_pr_scan;
        vm.selectedItemDocument_pr_scan = {} ;
        vm.alldocument_pr_scan = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemDocument_pr_scan_valide = {} ;
        vm.alldocument_pr_scan_valide = [] ;
        vm.alldocument_pr =[];

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;
        vm.stepFor = false;
        vm.myFile = [] ;

                //vm.showThParcourir = false;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

     /*   apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalide').then(function(result)
        {
            vm.allconvention_cisco_feffi_entete = result.data.response;
            console.log(vm.allconvention_cisco_feffi_entete);
        });

        //col table
        vm.convention_cisco_feffi_entete_column = [
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
        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;           
           
            vm.stepOne = true;
            vm.stepTwo = false;

           //recuperation donnée demande
            apiFactory.getAPIgeneraliserREST("document_pr_scan/index","menu","getdocument_pr_scanByConvention","id_convention_entete",item.id,'validation',0).then(function(result)
            {
                vm.alldocument_pr_scan = result.data.response; 
                console.log(vm.alldocument_pr_scan);
            });
            apiFactory.getAPIgeneraliserREST("document_pr_scan/index","menu","getdocument_pr_scanByConvention","id_convention_entete",item.id,'validation',1).then(function(result)
            {
                vm.alldocument_pr_scan_valide = result.data.response; 
                console.log(vm.alldocument_pr_scan_valide);
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;

        });  */           

  /*****************Fin StepOne convention_cisco_feffi_entete****************/
        var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
          var usercisco = result.data.response.cisco;
          //console.log(userc.id);
            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'DPFI'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }          
        });


/**********************************fin justificatif attachement****************************************/
      apiFactory.getAll("contrat_partenaire_relai/index").then(function(result)
      {
          vm.allcontrat_partenaire_relai = result.data.response; 
          console.log(vm.allcontrat_partenaire_relai);
      });

      apiFactory.getAll("document_pr/index").then(function(result)
      {
          vm.alldocument_pr = result.data.response; 
          console.log(vm.alldocument_pr);
      });

     apiFactory.getAll("document_pr_scan/index").then(function(result)
      {
        vm.alldocument_pr_scan = result.data.response;
          console.log(vm.alldocument_pr_scan);        
      });

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_pr_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_pr_scan.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterDocument_pr_scan= function ()
        { 
          
          if (NouvelItemDocument_pr_scan == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              fichier: '',
              date_elaboration: '',
              observation: '',
              id_document_pr: ''
            };
        
            vm.alldocument_pr_scan.push(items);
            vm.alldocument_pr_scan.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDocument_pr_scan = mem;
              }
            });

            NouvelItemDocument_pr_scan = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout document_pr_scan','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDocument_pr_scan(document_pr_scan,suppression)
        {
            if (NouvelItemDocument_pr_scan==false)
            {
                test_existanceDocument_pr_scan (document_pr_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_pr_scan(document_pr_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_pr_scan
        vm.annulerDocument_pr_scan = function(item)
        {
          if (NouvelItemDocument_pr_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_pr_scan.fichier ;
            item.date_elaboration   = currentItemDocument_pr_scan.date_elaboration ;
            item.observation   = currentItemDocument_pr_scan.observation ;
            item.id_contrat_partenaire_relai   = currentItemDocument_pr_scan.id_contrat_partenaire_relai ;
            item.id_document_pr   = currentItemDocument_pr_scan.id_document_pr ;
          }else
          {
            vm.alldocument_pr_scan = vm.alldocument_pr_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_pr_scan.id;
            });
          }

          vm.selectedItemDocument_pr_scan = {} ;
          NouvelItemDocument_pr_scan      = false;
          vm.showbuttonValidation = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_pr_scan= function (item)
        {
            vm.selectedItemDocument_pr_scan = item;
            vm.nouvelItemDocument_pr_scan   = item;
            currentItemDocument_pr_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_pr_scan));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemDocument_pr_scan', function()
        {
             if (!vm.alldocument_pr_scan) return;
             vm.alldocument_pr_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_pr_scan.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_pr_scan = function(item)
        {
            NouvelItemDocument_pr_scan = false ;
            vm.selectedItemDocument_pr_scan = item;
            currentItemDocument_pr_scan = angular.copy(vm.selectedItemDocument_pr_scan);
            $scope.vm.alldocument_pr_scan.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.fichier   = vm.selectedItemDocument_pr_scan.fichier ;
            item.date_elaboration   = new Date(vm.selectedItemDocument_pr_scan.date_elaboration) ;
            item.observation   = vm.selectedItemDocument_pr_scan.observation ;
            item.id_document_pr   = vm.selectedItemDocument_pr_scan.document_pr.id ;
            item.id_contrat_partenaire_relai   = vm.selectedItemDocument_pr_scan.contrat_partenaire_relai.id ;
            vm.showbuttonValidation = false;
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_pr_scan
        vm.supprimerDocument_pr_scan = function()
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
                vm.ajoutDocument_pr_scan(vm.selectedItemDocument_pr_scan,1);
                vm.showbuttonValidation = false;
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_pr_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_pr_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_pr_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_pr_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_pr_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_pr_scan.observation )
                    ||(mem[0].id_contrat_partenaire_relai   != currentItemDocument_pr_scan.contrat_partenaire_relai.id )
                    ||(mem[0].id_document_pr   != currentItemDocument_pr_scan.document_pr.id ))                   
                      { 
                         insert_in_baseDocument_pr_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_pr_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_pr_scan
        function insert_in_baseDocument_pr_scan(document_pr_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_pr_scan==false)
            {
                getId = vm.selectedItemDocument_pr_scan.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_pr_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                    observation: document_pr_scan.observation,
                    id_contrat_partenaire_relai: document_pr_scan.id_contrat_partenaire_relai,
                    id_document_pr: document_pr_scan.id_document_pr,
                    //id_convention_entete: vm.selectedItemConvention_cisco_feffi_entete.id,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
            {   
              var contr= vm.allcontrat_partenaire_relai.filter(function(obj)
                {
                    return obj.id == document_pr_scan.id_contrat_partenaire_relai;
                });
              var doc= vm.alldocument_pr.filter(function(obj)
                {
                    return obj.id == document_pr_scan.id_document_pr;
                });

              if (NouvelItemDocument_pr_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'document_pr_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_pr_scan.id
                                              
                          if(file)
                          { 

                            var name_file = contr[0].ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    document_pr_scan.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_pr_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                                      observation: document_pr_scan.observation,
                                                      id_contrat_partenaire_relai: contr[0].id,
                                                      id_document_pr: document_pr_scan.id_document_pr,
                                                      //id_convention_entete: vm.selectedItemConvention_cisco_feffi_entete.id,
                                                      validation:0
                                        });
                                      apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                      {                                           
                                         
                                          document_pr_scan.$selected = false;
                                          document_pr_scan.$edit = false;
                                          vm.selectedItemDocument_pr_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_pr_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_pr_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                        observation: document_pr_scan.observation,
                                        id_contrat_partenaire_relai: contr[0].id,
                                        id_document_pr: document_pr_scan.id_document_pr,
                                        //id_convention_entete: vm.selectedItemConvention_cisco_feffi_entete.id,
                                        validation:0               
                                    });
                                  apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_pr_scan.$selected = false;
                                      document_pr_scan.$edit = false;
                                      vm.selectedItemDocument_pr_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        vm.selectedItemDocument_pr_scan.document_pr = doc[0];
                        vm.selectedItemDocument_pr_scan.contrat_partenaire_relai = contr[0];
                        vm.selectedItemDocument_pr_scan.$selected  = false;
                        vm.selectedItemDocument_pr_scan.$edit      = false;
                        vm.selectedItemDocument_pr_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alldocument_pr_scan = vm.alldocument_pr_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_pr_scan.id;
                      });
                      var chemin= vm.selectedItemDocument_pr_scan.fichier;
                      var fd = new FormData();
                          fd.append('chemin',chemin);
                     
                      var uploadUrl  = apiUrl + "importer_fichier/remove_upload_file";

                      var upl= $http.post(uploadUrl,fd,{transformRequest: angular.identity,
                      headers: {'Content-Type': undefined}, chemin: chemin
                      }).success(function(data)
                      {
                         console.log('ok');
                      }).error(function()
                      {
                          showDialog(event,chemin);
                      });
                      vm.showbuttonValidation = false;
                    }
              }
              else
              {
                  document_pr_scan.id  =   String(data.response);              
                  NouvelItemDocument_pr_scan = false;

                    var file= vm.myFile[0];
                    
                    var repertoire = 'document_pr_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = contr[0].ref_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              document_pr_scan.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                fichier: document_pr_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                                observation: document_pr_scan.observation,
                                                id_contrat_partenaire_relai: contr[0].id,
                                                id_document_pr: document_pr_scan.id_document_pr,
                                                //id_convention_entete: vm.selectedItemConvention_cisco_feffi_entete.id,                                                
                                                validation:0
                                  });
                                apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                                { 
                                    document_pr_scan.$selected = false;
                                    document_pr_scan.$edit = false;
                                    vm.selectedItemDocument_pr_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_pr_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_pr_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                                  observation: document_pr_scan.observation,
                                  id_contrat_partenaire_relai: contr[0].id,
                                  id_document_pr: document_pr_scan.id_document_pr,
                                 // id_convention_entete: vm.selectedItemConvention_cisco_feffi_entete.id,
                                  validation:0               
                              });
                            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
                            {
                                  
                                document_pr_scan.$selected = false;
                                document_pr_scan.$edit = false;
                                vm.selectedItemDocument_pr_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              document_pr_scan.document_pr = doc[0];
              document_pr_scan.contrat_partenaire_relai = contr[0];
              document_pr_scan.$selected = false;
              document_pr_scan.$edit = false;
              vm.selectedItemDocument_pr_scan = {};
              vm.showbuttonValidation = false;
              vm.showbuttonValidation = false;
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDocument_pr_scan = function()
        {
          maj_in_baseDocument_pr_scan(vm.selectedItemDocument_pr_scan,0);
        }

        vm.selectionDocument_pr_scan_valide= function (item)
        {
            vm.selectedItemDocument_pr_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_pr_scan_valide', function()
        {
             if (!vm.alldocument_pr_scan_valide) return;
             vm.alldocument_pr_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_pr_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_pr_scan
        function maj_in_baseDocument_pr_scan(document_pr_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_pr_scan.id,
                    fichier: document_pr_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_pr_scan.date_elaboration)),
                    observation: document_pr_scan.observation,
                    id_contrat_partenaire_relai: document_pr_scan.contrat_partenaire_relai.id,
                    id_document_pr: document_pr_scan.document_pr.id,
                    //id_convention_entete: document_pr_scan.convention_entete.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_pr_scan/index",datas, config).success(function (data)
            {   

              vm.alldocument_pr_scan = vm.alldocument_pr_scan.filter(function(obj)
              {
                return obj.id !== document_pr_scan.id;
              });
              vm.alldocument_pr_scan_valide.push(document_pr_scan);
              vm.selectedItemDocument_pr_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_pr_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }
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
        
  
  function showDialog($event,items) {
       var parentEl = angular.element(document.body);
       $mdDialog.show({
         parent: parentEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '<md-subheader style="background-color: rgb(245,245,245)">'+
            '<h3 mat-dialog-title  style="margin:0px; color: red;">Erreur de suppression de fichier</h3>'+
          '</md-subheader>'+
           '  <md-dialog-content>'+
           '    <p>Veuillez communiquer ce réference à l\'administrateur</p>'+
           '    <p>Réference: {{items}}</p>'+
           '  </md-dialog-content>' +
           '  <md-dialog-actions>' +
           '    <md-button ng-click="closeDialog()" class="md-primary">' +
           '      Fermer' +
           '    </md-button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
         locals: {
           items: items
         },
         controller: DialogController
      });

    }

      function DialogController($scope, $mdDialog, items) {
        $scope.items = items;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    }
  
})();
