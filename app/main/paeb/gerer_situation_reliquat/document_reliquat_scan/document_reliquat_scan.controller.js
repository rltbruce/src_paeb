(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_reliquat.document_reliquat_scan')
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
        .controller('Document_reliquat_scanController', Document_reliquat_scanController);
    /** @ngInject */
    function Document_reliquat_scanController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile,$cookieStore)
    {
		    var vm = this;

        vm.selectedItemFeffi = {} ;
        vm.allfeffi = [] ;

        vm.selectedItemConvention_entete= {} ;
        vm.allconvention_entete= [] ;        

        vm.ajoutDocument_feffi_scan = ajoutDocument_feffi_scan;
        var NouvelItemDocument_feffi_scan=false;
        var currentItemDocument_feffi_scan;
        vm.selectedItemDocument_feffi_scan = {} ;
        vm.alldocument_feffi_scan = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemDocument_feffi_scan_valide = {} ;
        vm.alldocument_feffi_scan_valide = [] ;
        vm.alldocument_feffi =[];

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



/**********************************fin justificatif attachement****************************************/
      /*apiFactory.getAll("feffi/index").then(function(result)
        {
            vm.allfeffi = result.data.response; 
            console.log(vm.allfeffi);
        });*/

      apiFactory.getAll("document_feffi/index").then(function(result)
      {
          vm.alldocument_feffi = result.data.response; 
          console.log(vm.alldocument_feffi);
      });

      apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu','getdocumentByvalidation','validation',0).then(function(result)
      {
        vm.alldocument_feffi_scan = result.data.response;
          console.log(vm.alldocument_feffi_scan);        
      });
      apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu','getdocumentByvalidation','validation',1).then(function(result)
      {
        vm.alldocument_feffi_scan_valide = result.data.response;
          console.log(vm.alldocument_feffi_scan_valide);        
      });


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
            apiFactory.getAPIgeneraliserREST("feffi/index",'menus','getfeffiBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.allfeffi = result.data.response; 
                console.log(vm.allfeffi);
            });

            apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu','getdocument_invalideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.alldocument_feffi_scan = result.data.response; 
                console.log(vm.alldocument_feffi_scan);
            });

            apiFactory.getAPIgeneraliserREST("document_feffi_scan/index",'menu','getdocument_valideBycisco','id_cisco',usercisco.id).then(function(result)
            {
                vm.alldocument_feffi_scan_valide = result.data.response; 
                console.log(vm.alldocument_feffi_scan_valide);
            });
          }
          

        });

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_feffi_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_feffi_scan.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterDocument_feffi_scan= function ()
        { 
          
          if (NouvelItemDocument_feffi_scan == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              fichier: '',
              date_elaboration: '',
              observation: '',
              id_document_feffi: '',
              id_feffi: '',
              id_convention_entete: ''
            };
        
            vm.alldocument_feffi_scan.push(items);
            vm.alldocument_feffi_scan.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDocument_feffi_scan = mem;
              }
            });

            NouvelItemDocument_feffi_scan = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout document_feffi_scan','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDocument_feffi_scan(document_feffi_scan,suppression)
        {
            if (NouvelItemDocument_feffi_scan==false)
            {
                test_existanceDocument_feffi_scan (document_feffi_scan,suppression); 
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
            item.id_convention_entete   = currentItemDocument_feffi_scan.id_convention_entete ;
            item.id_document_feffi   = currentItemDocument_feffi_scan.id_document_feffi ;
          }else
          {
            vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_feffi_scan.id;
            });
          }

          vm.selectedItemDocument_feffi_scan = {} ;
          NouvelItemDocument_feffi_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_feffi_scan= function (item)
        {
            vm.selectedItemDocument_feffi_scan = item;
            vm.nouvelItemDocument_feffi_scan   = item;
            currentItemDocument_feffi_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_feffi_scan));
            vm.showbuttonValidation = true;
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
            NouvelItemDocument_feffi_scan = false ;
            vm.selectedItemDocument_feffi_scan = item;
            currentItemDocument_feffi_scan = angular.copy(vm.selectedItemDocument_feffi_scan);
            $scope.vm.alldocument_feffi_scan.forEach(function(jus) {
              jus.$edit = false;
            });

            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByfeffi','id_feffi',item.feffi.id).then(function(result)
            {
              vm.allconvention_entete= result.data.response;
            });

            item.$edit = true;
            item.$selected = true;
            item.fichier   = vm.selectedItemDocument_feffi_scan.fichier ;
            item.date_elaboration   = new Date(vm.selectedItemDocument_feffi_scan.date_elaboration) ;
            item.observation   = vm.selectedItemDocument_feffi_scan.observation ;
            item.id_document_feffi   = vm.selectedItemDocument_feffi_scan.document_feffi.id ;
            item.id_feffi   = vm.selectedItemDocument_feffi_scan.feffi.id ;
            item.id_convention_entete   = vm.selectedItemDocument_feffi_scan.convention_entete.id ;
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
                    ||(mem[0].observation   != currentItemDocument_feffi_scan.observation )
                    ||(mem[0].id_convention_entete   != currentItemDocument_feffi_scan.convention_entete.id )
                    ||(mem[0].id_document_feffi   != currentItemDocument_feffi_scan.document_feffi.id ))                   
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
                getId = vm.selectedItemDocument_feffi_scan.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: document_feffi_scan.id_convention_entete,
                    id_document_feffi: document_feffi_scan.id_document_feffi,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {   
              var conv= vm.allconvention_entete.filter(function(obj)
                {
                    return obj.id == document_feffi_scan.id_convention_entete;
                });
              var doc= vm.alldocument_feffi.filter(function(obj)
                {
                    return obj.id == document_feffi_scan.id_document_feffi;
                });

              if (NouvelItemDocument_feffi_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'document_feffi_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_feffi_scan.id
                                              
                          if(file)
                          { 

                            var name_file = conv[0].ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                                      fichier: document_feffi_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                                      observation: document_feffi_scan.observation,
                                                      id_convention_entete: document_feffi_scan.id_convention_entete,
                                                      id_document_feffi: document_feffi_scan.id_document_feffi,
                                                      validation:0
                                        });
                                      apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                      {                                           
                                         
                                          document_feffi_scan.$selected = false;
                                          document_feffi_scan.$edit = false;
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
                                        date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                        observation: document_feffi_scan.observation,
                                        id_convention_entete: document_feffi_scan.id_convention_entete,
                                        id_document_feffi: document_feffi_scan.id_document_feffi,
                                        validation:0               
                                    });
                                  apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_feffi_scan.$selected = false;
                                      document_feffi_scan.$edit = false;
                                      vm.selectedItemDocument_feffi_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        vm.selectedItemDocument_feffi_scan.document_feffi = doc[0];
                        vm.selectedItemDocument_feffi_scan.convention_entete = conv[0];
                        vm.selectedItemDocument_feffi_scan.$selected  = false;
                        vm.selectedItemDocument_feffi_scan.$edit      = false;
                        vm.selectedItemDocument_feffi_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_feffi_scan.id;
                      });
                      var chemin= vm.selectedItemDocument_feffi_scan.fichier;
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
                  document_feffi_scan.id  =   String(data.response);              
                  NouvelItemDocument_feffi_scan = false;

                    var file= vm.myFile[0];
                    
                    var repertoire = 'document_feffi_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = conv[0].ref_convention+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                                fichier: document_feffi_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                                observation: document_feffi_scan.observation,
                                                id_convention_entete: document_feffi_scan.id_convention_entete,
                                                id_document_feffi: document_feffi_scan.id_document_feffi,
                                                validation:0
                                  });
                                apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                                { 
                                    document_feffi_scan.$selected = false;
                                    document_feffi_scan.$edit = false;
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
                                  date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                                  observation: document_feffi_scan.observation,
                                  id_convention_entete: document_feffi_scan.id_convention_entete,
                                  id_document_feffi: document_feffi_scan.id_document_feffi,
                                  validation:0               
                              });
                            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
                            {
                                  
                                document_feffi_scan.$selected = false;
                                document_feffi_scan.$edit = false;
                                vm.selectedItemDocument_feffi_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              document_feffi_scan.document_feffi = doc[0];
              document_feffi_scan.convention_entete = conv[0];
              document_feffi_scan.$selected = false;
              document_feffi_scan.$edit = false;
              vm.selectedItemDocument_feffi_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDocument_feffi_scan = function()
        {
          maj_in_baseDocument_feffi_scan(vm.selectedItemDocument_feffi_scan,0);
        }

        vm.selectionDocument_feffi_scan_valide= function (item)
        {
            vm.selectedItemDocument_feffi_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_feffi_scan_valide', function()
        {
             if (!vm.alldocument_feffi_scan_valide) return;
             vm.alldocument_feffi_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_feffi_scan_valide.$selected = true;
        });
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
                    id:        document_feffi_scan.id,
                    fichier: document_feffi_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_feffi_scan.date_elaboration)),
                    observation: document_feffi_scan.observation,
                    id_convention_entete: document_feffi_scan.convention_entete.id,
                    id_document_feffi: document_feffi_scan.document_feffi.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_feffi_scan/index",datas, config).success(function (data)
            {   

              vm.alldocument_feffi_scan = vm.alldocument_feffi_scan.filter(function(obj)
              {
                return obj.id !== document_feffi_scan.id;
              });
              vm.alldocument_feffi_scan_valide.push(document_feffi_scan);
              vm.selectedItemDocument_feffi_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_feffi_scan = function(item)
        {
            window.location = apiUrlFile+item.fichier;
        }

        vm.change_feffi = function(item)
        {
          apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideByfeffi','id_feffi',item.id_feffi).then(function(result)
          {
            vm.allconvention_entete= result.data.response;
          });
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
