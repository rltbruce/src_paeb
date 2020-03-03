(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_entreprise.validation_demande_dpfi.validation_demande_tech_batiment_prestataire')
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
        .controller('Validation_demande_tech_batiment_prestataireController', Validation_demande_tech_batiment_prestataireController);
    /** @ngInject */
    function Validation_demande_tech_batiment_prestataireController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,apiUrlFile)
    {
		    var vm = this;
        vm.selectedItemContrat_prestataire = {} ;
        vm.allcontrat_prestataire = [] ;

        var currentItemDemande_batiment_prest;
        vm.selectedItemDemande_batiment_prest = {} ;
        vm.alldemande_batiment_prest = [] ;

        var currentItemJustificatif_batiment_pre;
        vm.selectedItemJustificatif_batiment_pre = {} ;
        vm.alljustificatif_batiment_pre = [] ;

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


          apiFactory.getAPIgeneraliserREST("demande_batiment_prestataire/index",'menu','getdemandeValidebcaf').then(function(result)
          {
            vm.alldemande_batiment_prest = result.data.response;
          });

/**********************************debut demande_batiment_prest****************************************/
//col table
        vm.demande_batiment_prest_column = [
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
         vm.validerDemande_batiment_prest= function(demande_batiment_prest,suppression,validation)
        {
            insert_in_baseDemande_batiment_prest(demande_batiment_prest,suppression,validation);
           
        }

        //fonction selection item Demande_batiment_prest
        vm.selectionDemande_batiment_prest= function (item)
        {
            vm.selectedItemDemande_batiment_prest = item;
            vm.nouvelItemDemande_batiment_prest   = item;
            currentItemDemande_batiment_prest    = JSON.parse(JSON.stringify(vm.selectedItemDemande_batiment_prest));
           if(item.id!=0)
           {
            apiFactory.getAPIgeneraliserREST("justificatif_batiment_pre/index",'id_demande_pay_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.alljustificatif_batiment_pre = result.data.response;
                console.log(vm.alljustificatif_batiment_pre);
            });

            apiFactory.getAPIgeneraliserREST("contrat_prestataire/index",'menus','getcontratconvenBydemande_batiment','id_demande_batiment_pre',vm.selectedItemDemande_batiment_prest.id).then(function(result)
            {
                vm.allinfosupplement = result.data.response;
                console.log(vm.allinfosupplement);
            });

            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
           }
            console.log(vm.selectedItemDemande_batiment_prest) ;
        };
        $scope.$watch('vm.selectedItemDemande_batiment_prest', function()
        {
             if (!vm.alldemande_batiment_prest) return;
             vm.alldemande_batiment_prest.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_batiment_prest.$selected = true;
        });

        //insertion ou mise a jours ou suppression item dans bdd Demande_batiment_prest
        function insert_in_baseDemande_batiment_prest(demande_batiment_prest,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_batiment_prest.id,
                    objet: demande_batiment_prest.objet,
                    description:demande_batiment_prest.description,
                    ref_facture:demande_batiment_prest.ref_facture,
                    id_tranche_demande_mpe: demande_batiment_prest.tranche.id ,
                    montant: demande_batiment_prest.montant,
                    cumul: demande_batiment_prest.cumul ,
                    anterieur: demande_batiment_prest.anterieur ,
                    reste: demande_batiment_prest.reste ,
                    date: convertionDate(new Date(demande_batiment_prest.date)),
                    id_batiment_construction: demande_batiment_prest.batiment_construction.id,
                    validation: validation               
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_batiment_prestataire/index",datas, config).success(function (data)
            {
                       
              vm.alldemande_batiment_prest = vm.alldemande_batiment_prest.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemDemande_batiment_prest.id;
              });                  
               vm.stepTwo=false;     
               
              demande_batiment_prest.$selected = false;
              demande_batiment_prest.$edit = false;
              vm.selectedItemDemande_batiment_prest = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
/**********************************fin demande_batiment_prest****************************************/

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
        vm.selectionJustificatif_batiment_pre= function (item)
        {
            vm.selectedItemJustificatif_batiment_pre = item;
            vm.nouvelItemJustificatif_batiment_pre   = item;
            currentItemJustificatif_batiment_pre    = JSON.parse(JSON.stringify(vm.selectedItemJustificatif_batiment_pre)); 
        };
        $scope.$watch('vm.selectedItemJustificatif_batiment_pre', function()
        {
             if (!vm.alljustificatif_batiment_pre) return;
             vm.alljustificatif_batiment_pre.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_batiment_pre.$selected = true;
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
