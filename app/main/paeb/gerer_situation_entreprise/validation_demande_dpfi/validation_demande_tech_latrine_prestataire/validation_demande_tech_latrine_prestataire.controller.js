(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.validation_demande_dpfi.validation_demande_tech_latrine_prestataire')
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
        .controller('Validation_demande_tech_latrine_prestataireController', Validation_demande_tech_latrine_prestataireController);
    /** @ngInject */
    function Validation_demande_tech_latrine_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        var currentItemDemande_latrine_prest;
        vm.selectedItemDemande_latrine_prest = {} ;
        vm.alldemande_latrine_prest = [] ;

        var currentItemJustificatif_latrine_pre;
        vm.selectedItemJustificatif_latrine_pre = {} ;
        vm.alljustificatif_latrine_pre = [] ;

        vm.allinfosupplement = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


          apiFactory.getAPIgeneraliserREST("demande_latrine_prestataire/index",'menu','getdemandeValidebcaf').then(function(result)
          {
            vm.alldemande_latrine_prest = result.data.response;
          });

/**********************************debut demande_latrine_prest****************************************/
//col table
        vm.demande_latrine_prest_column = [
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
         vm.validerDemande_latrine_prest= function(demande_latrine_prest,suppression,validation)
        {
            insert_in_baseDemande_latrine_prest(demande_latrine_prest,suppression,validation);
           
        }

        //fonction selection item Demande_latrine_prest
        vm.selectionDemande_latrine_prest= function (item)
        {
            vm.selectedItemDemande_latrine_prest = item;
            vm.nouvelItemDemande_latrine_prest   = item;
            currentItemDemande_latrine_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_latrine_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_latrine_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                vm.alljustificatif_latrine_pre = result.data.response;
                console.log(vm.alljustificatif_latrine_pre);
            });

            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratconvenBydemande_latrine','id_demande_latrine_pre',vm.selectedItemDemande_latrine_prest.id).then(function(result)
            {
                vm.allinfosupplement = result.data.response;
                console.log(vm.allinfosupplement);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
            console.log(vm.selectedItemDemande_latrine_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_latrine_prest', function()
        {
             if (!vm.alldemande_latrine_prest) return;
             vm.alldemande_latrine_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_latrine_prest.$selected = true;
        });

        //insertion ou mise a jours ou suppression item dans bdd Demande_latrine_prest
        function insert_in_baseDemande_latrine_prest(demande_latrine_prest,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_latrine_prest.id,
                    objet: demande_latrine_prest.objet,
                    description:demande_latrine_prest.description,
                    ref_facture:demande_latrine_prest.ref_facture,
                    id_tranche_demande_mpe: demande_latrine_prest.tranche.id ,
                    montant: demande_latrine_prest.montant,
                    cumul: demande_latrine_prest.cumul ,
                    anterieur: demande_latrine_prest.anterieur ,
                    reste: demande_latrine_prest.reste ,
                    date: convertionDate(new Date(demande_latrine_prest.date)),
                    id_contrat_prestataire: demande_latrine_prest.contrat_prestataire.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_latrine_prestataire/index",datas, config).success(function (data)
            {
                       
              vm.alldemande_latrine_prest = vm.alldemande_latrine_prest.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_latrine_prest.id;
              });                  
               vm.stepTwo=false;     
               
              demande_latrine_prest.$selected = false;
              demande_latrine_prest.$edit = false;
              vm.selectedItemDemande_latrine_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin demande_latrine_prest****************************************/

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
        vm.selectionJustificatif_latrine_pre= function (item)
        {
            vm.selectedItemJustificatif_latrine_pre = item;
            vm.nouvelItemJustificatif_latrine_pre   = item;
            currentItemJustificatif_latrine_pre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_latrine_pre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_latrine_pre', function()
        {
             if (!vm.alljustificatif_latrine_pre) return;
             vm.alljustificatif_latrine_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_latrine_pre.$selected = true;
        });

        vm.download_attachement = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }
        //insertion ou mise a jours ou suppression item dans bdd Justificatif_attachement
        
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
