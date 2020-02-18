(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.validation_fina_demande_payement_prestataire')
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
        .controller('Validation_fina_demande_payement_prestataireController', Validation_fina_demande_payement_prestataireController);
    /** @ngInject */
    function Validation_fina_demande_payement_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        var currentItemDemande_payement_prest;
        vm.selectedItemDemande_payement_prest = {} ;
        vm.alldemande_payement_prest = [] ;

        var currentItemJustificatif_attachement;
        vm.selectedItemJustificatif_attachement = {} ;
        vm.alljustificatif_attachement = [] ;

        var currentItemJustificatif_facture;
        vm.selectedItemJustificatif_facture = {} ;
        vm.alljustificatif_facture = [] ;

        var currentItemJustificatif_autre;
        vm.selectedItemJustificatif_autre = {} ;
        vm.alljustificatif_autre = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut feffi****************************************/

        //col table
      /*  vm.contrat_prestataire_column = [
        {titre:"Numero contrat"
        },
        {titre:"Description"
        },
        {titre:"Cout batiment"
        },
        {titre:"Cout latrine"
        },
        {titre:"Cout mobilier"
        },
        {titre:"Nom entreprise"
        },
        {titre:"Date signature"
        }];*/


          apiFactory.getAPIgeneraliserREST("demande_payement_prestataire/index",'menu','getdemandeValidetechnique').then(function(result)
          {
            vm.alldemande_payement_prest = result.data.response;
          });

/**********************************debut demande_payement_prest****************************************/
//col table
        vm.demande_payement_prest_column = [
        {titre:"Objet"
        },
        {titre:"Description"
        },
        {titre:"Référence facture"
        },
        {titre:"Tranche"
        },
        {titre:"Montant"
        },
        {titre:"Cumul"
        },
        {titre:"Antérieur"
        },
        {titre:"Periode"
        },
        {titre:"Pourcentage"
        },
        {titre:"Reste à décaisser"
        },
        {titre:"Date"
        },
        {titre:"Action"
        }];

        //fonction ajout dans bdd
         vm.validerDemande_payement_prest= function(demande_payement_prest,suppression,validation)
        {
            insert_in_baseDemande_payement_prest(demande_payement_prest,suppression,validation);
           
        }

        //fonction selection item Demande_payement_prest
        vm.selectionDemande_payement_prest= function (item)
        {
            vm.selectedItemDemande_payement_prest = item;
            vm.nouvelItemDemande_payement_prest   = item;
            currentItemDemande_payement_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_payement_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_attachement/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_attachement = result.data.response;
                console.log(vm.alljustificatif_attachement);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_facture/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_facture = result.data.response;
                console.log(vm.alljustificatif_facture);
            });

            apiFactory.getAPIgeneraliserREST("justificatif_autre_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_payement_prest.id).then(function(result)
            {
                vm.alljustificatif_autre = result.data.response;
                console.log(vm.alljustificatif_autre);
            });

            vm.stepTwo = true;
            vm.stepThree = false;
           }
            console.log(vm.selectedItemDemande_payement_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_payement_prest', function()
        {
             if (!vm.alldemande_payement_prest) return;
             vm.alldemande_payement_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_payement_prest.$selected = true;
        });

        //insertion ou mise a jours ou suppression item dans bdd Demande_payement_prest
        function insert_in_baseDemande_payement_prest(demande_payement_prest,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_payement_prest.id,
                    objet: demande_payement_prest.objet,
                    description:demande_payement_prest.description,
                    ref_facture:demande_payement_prest.ref_facture,
                    id_tranche_demande_mpe: demande_payement_prest.id_tranche_demande_mpe ,
                    montant: demande_payement_prest.montant,
                    cumul: demande_payement_prest.cumul ,
                    anterieur: demande_payement_prest.anterieur ,
                    reste: demande_payement_prest.reste ,
                    date: convertionDate(new Date(demande_payement_prest.date)),
                    id_contrat_prestataire: vm.selectedItemContrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_payement_prestataire/index",datas, config).success(function (data)
            {
                       
              vm.alldemande_payement_prest = vm.alldemande_payement_prest.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_payement_prest.id;
              });                  
               vm.stepTwo=false;     
               
              demande_payement_prest.$selected = false;
              demande_payement_prest.$edit = false;
              vm.selectedItemDemande_payement_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin demande_payement_prest****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_attachement_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

        //fonction selection item region
        vm.selectionJustificatif_attachement= function (item)
        {
            vm.selectedItemJustificatif_attachement = item;
            vm.nouvelItemJustificatif_attachement   = item;
            currentItemJustificatif_attachement    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_attachement)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_attachement', function()
        {
             if (!vm.alljustificatif_attachement) return;
             vm.alljustificatif_attachement.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_attachement.$selected = true;
        });

        vm.download_attachement = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
        //insertion ou mise a jours ou suppression item dans bdd Justificatif_attachement
        
/**********************************fin mpe_sousmissionnaire****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_facture_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];


        //fonction selection item region
        vm.selectionJustificatif_facture= function (item)
        {
            vm.selectedItemJustificatif_facture = item;
            vm.nouvelItemJustificatif_facture   = item;
            currentItemJustificatif_facture    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_facture)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_facture', function()
        {
             if (!vm.alljustificatif_facture) return;
             vm.alljustificatif_facture.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_facture.$selected = true;
        });

        vm.download_facture = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

/**********************************fin mpe_sousmissionnaire****************************************/

/**********************************fin justificatif attachement****************************************/

//col table
        vm.justificatif_autre_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];


        //fonction selection item region
        vm.selectionJustificatif_autre= function (item)
        {
            vm.selectedItemJustificatif_autre = item;
            vm.nouvelItemJustificatif_autre   = item;
            currentItemJustificatif_autre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_autre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_autre', function()
        {
             if (!vm.alljustificatif_autre) return;
             vm.alljustificatif_autre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_autre.$selected = true;
        });

        vm.download_autre = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

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
