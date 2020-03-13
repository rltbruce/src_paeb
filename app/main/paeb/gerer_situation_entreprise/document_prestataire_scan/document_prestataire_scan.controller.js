(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.document_prestataire_scan')
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
        .controller('Document_prestataire_scanController', Document_prestataire_scanController);
    /** @ngInject */
    function Document_prestataire_scanController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;

        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;        

        vm.ajoutDocument_prestataire_scan = ajoutDocument_prestataire_scan;
        var NouvelItemDocument_prestataire_scan=false;
        var currentItemDocument_prestataire_scan;
        vm.selectedItemDocument_prestataire_scan = {} ;
        vm.alldocument_prestataire_scan = [] ;
        vm.showbuttonValidation = false;

        vm.selectedItemDocument_prestataire_scan_valide = {} ;
        vm.alldocument_prestataire_scan_valide = [] ;
        vm.alldocument_prestataire =[];

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
      apiFactory.getAll("contrat_prestataire/index").then(function(result)
      {
          vm.allcontrat_prestataire = result.data.response; 
          console.log(vm.allcontrat_prestataire);
      });

      apiFactory.getAll("document_prestataire/index").then(function(result)
      {
          vm.alldocument_prestataire = result.data.response; 
          console.log(vm.alldocument_prestataire);
      });

      apiFactory.getAll("document_prestataire_scan/index").then(function(result)
      {
        vm.alldocument_prestataire_scan = result.data.response;
          console.log(vm.alldocument_prestataire_scan);        
      });

        $scope.uploadFile = function(event)
       {
          console.dir(event);
          var files = event.target.files;
          vm.myFile = files;
          vm.selectedItemDocument_prestataire_scan.fichier = vm.myFile[0].name;
          //console.log(vm.selectedItemDocument_prestataire_scan.fichier);
        } 

        //Masque de saisi ajout
        vm.ajouterDocument_prestataire_scan= function ()
        { 
          
          if (NouvelItemDocument_prestataire_scan == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              fichier: '',
              date_elaboration: '',
              observation: '',
              id_document_prestataire: ''
            };
        
            vm.alldocument_prestataire_scan.push(items);
            vm.alldocument_prestataire_scan.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemDocument_prestataire_scan = mem;
              }
            });

            NouvelItemDocument_prestataire_scan = true ;
            //vm.showThParcourir = true;
          }else
          {
            vm.showAlert('Ajout document_prestataire_scan','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            if (NouvelItemDocument_prestataire_scan==false)
            {
                test_existanceDocument_prestataire_scan (document_prestataire_scan,suppression); 
            } 
            else
            {
                insert_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression);
            }
        }

        //fonction de bouton d'annulation document_prestataire_scan
        vm.annulerDocument_prestataire_scan = function(item)
        {
          if (NouvelItemDocument_prestataire_scan == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.fichier   = currentItemDocument_prestataire_scan.fichier ;
            item.date_elaboration   = currentItemDocument_prestataire_scan.date_elaboration ;
            item.observation   = currentItemDocument_prestataire_scan.observation ;
            item.id_contrat_prestataire   = currentItemDocument_prestataire_scan.id_contrat_prestataire ;
            item.id_document_prestataire   = currentItemDocument_prestataire_scan.id_document_prestataire ;
          }else
          {
            vm.alldocument_prestataire_scan = vm.alldocument_prestataire_scan.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDocument_prestataire_scan.id;
            });
          }

          vm.selectedItemDocument_prestataire_scan = {} ;
          NouvelItemDocument_prestataire_scan      = false;
          
        };

        //fonction selection item justificatif batiment
        vm.selectionDocument_prestataire_scan= function (item)
        {
            vm.selectedItemDocument_prestataire_scan = item;
            vm.nouvelItemDocument_prestataire_scan   = item;
            currentItemDocument_prestataire_scan    = JSON.parse(JSON.stringify(vm.selectedItemDocument_prestataire_scan));
            vm.showbuttonValidation = true;
        };
        $scope.$watch('vm.selectedItemDocument_prestataire_scan', function()
        {
             if (!vm.alldocument_prestataire_scan) return;
             vm.alldocument_prestataire_scan.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_prestataire_scan.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierDocument_prestataire_scan = function(item)
        {
            NouvelItemDocument_prestataire_scan = false ;
            vm.selectedItemDocument_prestataire_scan = item;
            currentItemDocument_prestataire_scan = angular.copy(vm.selectedItemDocument_prestataire_scan);
            $scope.vm.alldocument_prestataire_scan.forEach(function(jus) {
              jus.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.fichier   = vm.selectedItemDocument_prestataire_scan.fichier ;
            item.date_elaboration   = new Date(vm.selectedItemDocument_prestataire_scan.date_elaboration) ;
            item.observation   = vm.selectedItemDocument_prestataire_scan.observation ;
            item.id_document_prestataire   = vm.selectedItemDocument_prestataire_scan.document_prestataire.id ;
            item.id_contrat_prestataire   = vm.selectedItemDocument_prestataire_scan.contrat_prestataire.id ;
            //console.log(item);
            //vm.showThParcourir = true;
        };

        //fonction bouton suppression item document_prestataire_scan
        vm.supprimerDocument_prestataire_scan = function()
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
                vm.ajoutDocument_prestataire_scan(vm.selectedItemDocument_prestataire_scan,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existanceDocument_prestataire_scan (item,suppression)
        {          
            if (suppression!=1)
            {
               var mem = vm.alldocument_prestataire_scan.filter(function(obj)
                {
                   return obj.id == currentItemDocument_prestataire_scan.id;
                });
                if(mem[0])
                {
                   if((mem[0].fichier   != currentItemDocument_prestataire_scan.fichier )
                    ||(mem[0].date_elaboration   != currentItemDocument_prestataire_scan.date_elaboration )
                    ||(mem[0].observation   != currentItemDocument_prestataire_scan.observation )
                    ||(mem[0].id_contrat_prestataire   != currentItemDocument_prestataire_scan.contrat_prestataire.id )
                    ||(mem[0].id_document_prestataire   != currentItemDocument_prestataire_scan.document_prestataire.id ))                   
                      { 
                         insert_in_baseDocument_prestataire_scan(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDocument_prestataire_scan(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd document_prestataire_scan
        function insert_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDocument_prestataire_scan==false)
            {
                getId = vm.selectedItemDocument_prestataire_scan.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    fichier: document_prestataire_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                    observation: document_prestataire_scan.observation,
                    id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                    id_document_prestataire: document_prestataire_scan.id_document_prestataire,
                    validation:0               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
            {   
              var contr= vm.allcontrat_prestataire.filter(function(obj)
                {
                    return obj.id == document_prestataire_scan.id_contrat_prestataire;
                });
              var doc= vm.alldocument_prestataire.filter(function(obj)
                {
                    return obj.id == document_prestataire_scan.id_document_prestataire;
                });

              if (NouvelItemDocument_prestataire_scan == false)
              {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                         var file= vm.myFile[0];
                    
                          var repertoire = 'document_prestataire_scan/';
                          var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                          var getIdFile = vm.selectedItemDocument_prestataire_scan.id
                                              
                          if(file)
                          { 

                            var name_file = contr[0].num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                                    document_prestataire_scan.fichier='';
                                  var datas = $.param({
                                                      supprimer: suppression,
                                                      id:        getIdFile,
                                                      fichier: document_prestataire_scan.fichier,
                                                      date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                                      observation: document_prestataire_scan.observation,
                                                      id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                                      id_document_prestataire: document_prestataire_scan.id_document_prestataire,
                                                      validation:0
                                        });
                                      apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                      {                                           
                                         
                                          document_prestataire_scan.$selected = false;
                                          document_prestataire_scan.$edit = false;
                                          vm.selectedItemDocument_prestataire_scan = {};
                                      console.log('b');
                                      }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                  });
                                }
                                else
                                {
                                  document_prestataire_scan.fichier=repertoire+data['nomFile'];
                                  var datas = $.param({
                                        supprimer: suppression,
                                        id:        getIdFile,
                                        fichier: document_prestataire_scan.fichier,
                                        date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                        observation: document_prestataire_scan.observation,
                                        id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                        id_document_prestataire: document_prestataire_scan.id_document_prestataire,
                                        validation:0               
                                    });
                                  apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                  {
                                       
                                      document_prestataire_scan.$selected = false;
                                      document_prestataire_scan.$edit = false;
                                      vm.selectedItemDocument_prestataire_scan = {};
                                      console.log('e');
                                  }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                                }
                            }).error(function()
                            {
                              vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                            });
                          }
                        vm.selectedItemDocument_prestataire_scan.document_prestataire = doc[0];
                        vm.selectedItemDocument_prestataire_scan.contrat_prestataire = contr[0];
                        vm.selectedItemDocument_prestataire_scan.$selected  = false;
                        vm.selectedItemDocument_prestataire_scan.$edit      = false;
                        vm.selectedItemDocument_prestataire_scan ={};
                        vm.showbuttonValidation = false;
                    }
                    else 
                    {    
                      vm.alldocument_prestataire_scan = vm.alldocument_prestataire_scan.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDocument_prestataire_scan.id;
                      });
                      var chemin= vm.selectedItemDocument_prestataire_scan.fichier;
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
                  document_prestataire_scan.id  =   String(data.response);              
                  NouvelItemDocument_prestataire_scan = false;

                    var file= vm.myFile[0];
                    
                    var repertoire = 'document_prestataire_scan/';
                    var uploadUrl  = apiUrl + "importer_fichier/save_upload_file";
                    var getIdFile = String(data.response);
                                        
                    if(file)
                    { 

                      var name_file = contr[0].num_contrat+'_'+getIdFile+'_'+vm.myFile[0].name ;

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
                              document_prestataire_scan.fichier='';
                            var datas = $.param({
                                                supprimer: suppression,
                                                id:        getIdFile,
                                                fichier: document_prestataire_scan.fichier,
                                                date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                                observation: document_prestataire_scan.observation,
                                                id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                                id_document_prestataire: document_prestataire_scan.id_document_prestataire,
                                                validation:0
                                  });
                                apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                                { 
                                    document_prestataire_scan.$selected = false;
                                    document_prestataire_scan.$edit = false;
                                    vm.selectedItemDocument_prestataire_scan = {};
                                console.log('b');
                                }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                            });
                          }
                          else
                          {
                            document_prestataire_scan.fichier=repertoire+data['nomFile'];
                            var datas = $.param({
                                  supprimer: suppression,
                                  id:        getIdFile,
                                  fichier: document_prestataire_scan.fichier,
                                  date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                                  observation: document_prestataire_scan.observation,
                                  id_contrat_prestataire: document_prestataire_scan.id_contrat_prestataire,
                                  id_document_prestataire: document_prestataire_scan.id_document_prestataire,
                                  validation:0               
                              });
                            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
                            {
                                  
                                document_prestataire_scan.$selected = false;
                                document_prestataire_scan.$edit = false;
                                vm.selectedItemDocument_prestataire_scan = {};
                                console.log('e');
                            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});
                          }
                      }).error(function()
                      {
                        vm.showAlert("Information","Erreur lors de l'enregistrement du fichier");
                      });
                    }
              }
              document_prestataire_scan.document_prestataire = doc[0];
              document_prestataire_scan.contrat_prestataire = contr[0];
              document_prestataire_scan.$selected = false;
              document_prestataire_scan.$edit = false;
              vm.selectedItemDocument_prestataire_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.validerDocument_prestataire_scan = function()
        {
          maj_in_baseDocument_prestataire_scan(vm.selectedItemDocument_prestataire_scan,0);
        }

        vm.selectionDocument_prestataire_scan_valide= function (item)
        {
            vm.selectedItemDocument_prestataire_scan_valide = item;
        };
        $scope.$watch('vm.selectedItemDocument_prestataire_scan_valide', function()
        {
             if (!vm.alldocument_prestataire_scan_valide) return;
             vm.alldocument_prestataire_scan_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDocument_prestataire_scan_valide.$selected = true;
        });
                //insertion ou mise a jours ou suppression item dans bdd document_prestataire_scan
        function maj_in_baseDocument_prestataire_scan(document_prestataire_scan,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        document_prestataire_scan.id,
                    fichier: document_prestataire_scan.fichier,
                    date_elaboration: convertionDate(new Date(document_prestataire_scan.date_elaboration)),
                    observation: document_prestataire_scan.observation,
                    id_contrat_prestataire: document_prestataire_scan.contrat_prestataire.id,
                    id_document_prestataire: document_prestataire_scan.document_prestataire.id,
                    validation:1               
                });
                console.log(datas);
                //factory
            apiFactory.add("document_prestataire_scan/index",datas, config).success(function (data)
            {   

              vm.alldocument_prestataire_scan = vm.alldocument_prestataire_scan.filter(function(obj)
              {
                return obj.id !== document_prestataire_scan.id;
              });
              vm.alldocument_prestataire_scan_valide.push(document_prestataire_scan);
              vm.selectedItemDocument_prestataire_scan = {};
              vm.showbuttonValidation = false;

          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.download_document_prestataire_scan = function(item)
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
