(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.document_moe_scan')
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
        .controller('Document_moe_scanController', Document_moe_scanController);
    /** @ngInject */
    function Document_moe_scanController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;        

        vm.ajoutDocument_moe_scan = ajoutDocument_moe_scan;
        var NouvelItemDocument_moe_scan=false;
        var currentItemDocument_moe_scan;
        vm.selectedItemDocument_moe_scan = {} ;
        vm.alldocument_moe_scan = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemDocument_moe_scan_valide = {} ;
        vm.alldocument_moe_scan_valide = [] ;
        vm.alldocument_moe =[];

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
      apiFactory.getAll("contrat_be/index").then(function(result)
      {
          vm.allcontrat_bureau_etude = result.data.response; 
          console.log(vm.allcontrat_bureau_etude);
      });

      apiFactory.getAll("document_moe/index").then(function(result)
      {
          vm.alldocument_moe = result.data.response; 
          console.log(vm.alldocument_moe);
      });

      apiFactory.getAll("document_moe_scan/index").then(function(result)
      {
        vm.alldocument_moe_scan = result.data.response;
          console.log(vm.alldocument_moe_scan);        
      });

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_moe_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_moe_scan.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterDocument_moe_scan= function ()
        { 
          
          if (NouvelItemDocument_moe_scan == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              fichier: '',
              date_elaboration: '',
              observation: '',
              id_document_moe: ''
            };
        
            vm.alldocument_moe_scan.push(items);
            vm.alldocument_moe_scan.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDocument_moe_scan = mem;
              }
            });

            NouvelItemDocument_moe_scan = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout document_moe_scan','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDocument_moe_scan(document_moe_scan,suppression)
        {
            if (NouvelItemDocument_moe_scan==false)
            {
                test_existanceDocument_moe_scan (document_moe_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_moe_scan(document_moe_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_moe_scan
        vm.annulerDocument_moe_scan = function(item)
        {
          if (NouvelItemDocument_moe_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_moe_scan.fichier ;
            item.date_elaboration   = currentItemDocument_moe_scan.date_elaboration ;
            item.observation   = currentItemDocument_moe_scan.observation ;
            item.id_contrat_bureau_etude   = currentItemDocument_moe_scan.id_contrat_bureau_etude ;
            item.id_document_moe   = currentItemDocument_moe_scan.id_document_moe ;
          }else
          {
            vm.alldocument_moe_scan = vm.alldocument_moe_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_moe_scan.id;
            });
          }

          vm.selectedItemDocument_moe_scan = {} ;
          NouvelItemDocument_moe_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_moe_scan= function (item)
        {
            vm.selectedItemDocument_moe_scan = item;
            vm.nouvelItemDocument_moe_scan   = item;
            currentItemDocument_moe_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_moe_scan));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemDocument_moe_scan', function()
        {
             if (!vm.alldocument_moe_scan) return;
             vm.alldocument_moe_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_moe_scan.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_moe_scan = function(item)
        {
            NouvelItemDocument_moe_scan = false ;
            vm.selectedItemDocument_moe_scan = item;
            currentItemDocument_moe_scan = angular.copy(vm.selectedItemDocument_moe_scan);
            $scope.vm.alldocument_moe_scan.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.fichier   = vm.selectedItemDocument_moe_scan.fichier ;
            item.date_elaboration   = new Date(vm.selectedItemDocument_moe_scan.date_elaboration) ;
            item.observation   = vm.selectedItemDocument_moe_scan.observation ;
            item.id_document_moe   = vm.selectedItemDocument_moe_scan.document_moe.id ;
            item.id_contrat_bureau_etude   = vm.selectedItemDocument_moe_scan.contrat_bureau_etude.id ;
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_moe_scan
        vm.supprimerDocument_moe_scan = function()
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
                vm.ajoutDocument_moe_scan(vm.selectedItemDocument_moe_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_moe_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_moe_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_moe_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_moe_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_moe_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_moe_scan.observation )
                    ||(mem[0].id_contrat_bureau_etude   != currentItemDocument_moe_scan.contrat_bureau_etude.id )
                    ||(mem[0].id_document_moe   != currentItemDocument_moe_scan.document_moe.id ))                   
                      { 
                         insert_in_baseDocument_moe_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_moe_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_moe_scan
        function insert_in_baseDocument_moe_scan(document_moe_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_moe_scan==false)
            {
                getId = vm.selectedItemDocument_moe_scan.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_moe_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                    observation: document_moe_scan.observation,
                    id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                    id_document_moe: document_moe_scan.id_document_moe,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
            {   
              var contr= vm.allcontrat_bureau_etude.filter(function(obj)
                {
                    return obj.id == document_moe_scan.id_contrat_bureau_etude;
                });
              var doc= vm.alldocument_moe.filter(function(obj)
                {
                    return obj.id == document_moe_scan.id_document_moe;
                });

              if (NouvelItemDocument_moe_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'document_moe_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_moe_scan.id
                                              
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
                                    document_moe_scan.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_moe_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                                      observation: document_moe_scan.observation,
                                                      id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                                      id_document_moe: document_moe_scan.id_document_moe,
                                                      validation:0
                                        });
                                      apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                      {                                           
                                         
                                          document_moe_scan.$selected = false;
                                          document_moe_scan.$edit = false;
                                          vm.selectedItemDocument_moe_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_moe_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_moe_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                        observation: document_moe_scan.observation,
                                        id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                        id_document_moe: document_moe_scan.id_document_moe,
                                        validation:0               
                                    });
                                  apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_moe_scan.$selected = false;
                                      document_moe_scan.$edit = false;
                                      vm.selectedItemDocument_moe_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        vm.selectedItemDocument_moe_scan.document_moe = doc[0];
                        vm.selectedItemDocument_moe_scan.contrat_bureau_etude = contr[0];
                        vm.selectedItemDocument_moe_scan.$selected  = false;
                        vm.selectedItemDocument_moe_scan.$edit      = false;
                        vm.selectedItemDocument_moe_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alldocument_moe_scan = vm.alldocument_moe_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_moe_scan.id;
                      });
                      var chemin= vm.selectedItemDocument_moe_scan.fichier;
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
                  document_moe_scan.id  =   String(data.response);              
                  NouvelItemDocument_moe_scan = false;

                    var file= vm.myFile[0];
                    
                    var repertoire = 'document_moe_scan/';
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
                              document_moe_scan.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                fichier: document_moe_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                                observation: document_moe_scan.observation,
                                                id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                                id_document_moe: document_moe_scan.id_document_moe,
                                                validation:0
                                  });
                                apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                                { 
                                    document_moe_scan.$selected = false;
                                    document_moe_scan.$edit = false;
                                    vm.selectedItemDocument_moe_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_moe_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_moe_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                                  observation: document_moe_scan.observation,
                                  id_contrat_bureau_etude: document_moe_scan.id_contrat_bureau_etude,
                                  id_document_moe: document_moe_scan.id_document_moe,
                                  validation:0               
                              });
                            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
                            {
                                  
                                document_moe_scan.$selected = false;
                                document_moe_scan.$edit = false;
                                vm.selectedItemDocument_moe_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              document_moe_scan.document_moe = doc[0];
              document_moe_scan.contrat_bureau_etude = contr[0];
              document_moe_scan.$selected = false;
              document_moe_scan.$edit = false;
              vm.selectedItemDocument_moe_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDocument_moe_scan = function()
        {
          maj_in_baseDocument_moe_scan(vm.selectedItemDocument_moe_scan,0);
        }

        vm.selectionDocument_moe_scan_valide= function (item)
        {
            vm.selectedItemDocument_moe_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_moe_scan_valide', function()
        {
             if (!vm.alldocument_moe_scan_valide) return;
             vm.alldocument_moe_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_moe_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_moe_scan
        function maj_in_baseDocument_moe_scan(document_moe_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_moe_scan.id,
                    fichier: document_moe_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_moe_scan.date_elaboration)),
                    observation: document_moe_scan.observation,
                    id_contrat_bureau_etude: document_moe_scan.contrat_bureau_etude.id,
                    id_document_moe: document_moe_scan.document_moe.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_moe_scan/index",datas, config).success(function (data)
            {   

              vm.alldocument_moe_scan = vm.alldocument_moe_scan.filter(function(obj)
              {
                return obj.id !== document_moe_scan.id;
              });
              vm.alldocument_moe_scan_valide.push(document_moe_scan);
              vm.selectedItemDocument_moe_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_moe_scan = function(item)
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
