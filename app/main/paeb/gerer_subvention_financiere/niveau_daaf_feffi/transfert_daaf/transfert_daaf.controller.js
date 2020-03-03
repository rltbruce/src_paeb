(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_daaf_feffi.transfert_daaf')
        .controller('Transfert_daafController', Transfert_daafController)
        .controller('ConventionDialogController', ConventionDialogController)
    /** @ngInject */
    function Transfert_daafController($mdDialog, $scope, apiFactory, $state,loginService,apiUrlFile)
    {
		    var vm    = this;
            vm.stepOne   = false;
            vm.stepTwo  = false;

    //initialisation

        vm.selectedItemDemande_realimentation = {} ; 
        vm.alldemande_realimentation_valide  = [] ;

        var NouvelItemTransfert_daaf = false;
        var currentItemTransfert_daaf;
        vm.selectedItemTransfert_daaf = {} ;
        vm.ajoutTransfert_daaf  = ajoutTransfert_daaf ;

        vm.showbuttonNouvtransfert= true;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        //recuperation donnée tranche deblocage feffi
        apiFactory.getAll("tranche_deblocage_feffi/index").then(function(result)
        {
          vm.alltranche_deblocage_feffi= result.data.response;
         // vm.allcurenttranche_deblocage_feffi = result.data.response;
              //console.log(vm.allcurenttranche_deblocage_feffi);
        });
        

  /*****************Debut StepOne convention_cisco_feffi_entete***************/

  

       /* apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_invalide","validation",1).then(function(result)
        {
            vm.alldemande_realimentation_invalide = result.data.response;
            if (vm.alldemande_realimentation_invalide.length>0)
            {
              vm.countDemandeInvalide = vm.alldemande_realimentation_invalide.length
            }
            
        }); */

        //recuperation donnée demande valide
        apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemande_realimentation_feffi_invalide","validation",3).then(function(result)
        {
            vm.alldemande_realimentation_valide = result.data.response;
            console.log(vm.alldemande_realimentation_valide);
        });

      vm.demande_realimentation_valide_column = [
        {titre:"Numero compte"},        
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Date"},
        {titre:"Action"}];


        //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {   vm.stepOne   = true;
            vm.selectedItemDemande_realimentation = item;
            //recuperation donnée transfert_daaf
            apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'id_demande_rea_feffi',item.id).then(function(result)
            {
                vm.alltransfert_daaf = result.data.response;
                if (vm.alltransfert_daaf.length >0)
                {
                  vm.showbuttonNouvtransfert= false;
                }
            });
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation_valide) return;
             vm.alldemande_realimentation_valide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

        vm.plusInfoDemande = function(item)
        {
          var confirm = $mdDialog.confirm({
          controller: ConventionDialogController,
          templateUrl: 'app/main/paeb/gerer_subvention_financiere/niveau_daaf_feffi/transfert_daaf/conventiondialog.html',
          parent: angular.element(document.body),
          targetEvent: item,
          locals: {datatopass: item}
          
          })

              $mdDialog.show(confirm);
        }

  /*****************Fin StepOne demande_realimentation_feffi****************/

  /*****************Debut StepTwo transfert_daaf****************/
 //col table
        vm.transfert_daaf_column = [
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterTransfert_daaf = function ()
        { 
          if (NouvelItemTransfert_daaf == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_transfert: parseInt(vm.selectedItemDemande_realimentation.prevu),
              frais_bancaire:'',
              montant_total:'',
              date:'',
              observation:''
            };         
            vm.alltransfert_daaf.push(items);
            vm.alltransfert_daaf.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemTransfert_daaf = conv;
              }
            });

            NouvelItemTransfert_daaf = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutTransfert_daaf(transfert_daaf,suppression)
        {
            if (NouvelItemTransfert_daaf==false)
            {
                test_existanceTransfert_daaf (transfert_daaf,suppression); 
            } 
            else
            {
                insert_in_baseTransfert_daaf(transfert_daaf,suppression);
            }
        }

        //fonction de bouton d'annulation transfert_daaf
        vm.annulerTransfert_daaf = function(item)
        {
          if (NouvelItemTransfert_daaf == false)
          {
              item.$edit = false;
              item.$selected = false;

              item.montant_transfert = currentItemTransfert_daaf.montant_transfert;
              item.frais_bancaire = currentItemTransfert_daaf.frais_bancaire;
              item.montant_total = currentItemTransfert_daaf.montant_total;
              item.date = currentItemTransfert_daaf.date;
              item.observation    = currentItemTransfert_daaf.observation; 
          }else
          {
            vm.alltransfert_daaf = vm.alltransfert_daaf.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTransfert_daaf.id;
            });
          }

          vm.selectedItemTransfert_daaf = {} ;
          NouvelItemTransfert_daaf      = false;
          
        };

        //fonction selection item Transfert_daaf convention cisco/feffi
        vm.selectionTransfert_daaf = function (item)
        {
            vm.selectedItemTransfert_daaf = item;
            currentItemTransfert_daaf     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_daaf));
           // vm.allconvention= [] ;
            vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemTransfert_daaf', function()
        {
             if (!vm.alltransfert_daaf) return;
             vm.alltransfert_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_daaf.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTransfert_daaf = function(item)
        {
            NouvelItemTransfert_daaf = false ;
            vm.selectedItemTransfert_daaf = item;
            currentItemTransfert_daaf = angular.copy(vm.selectedItemTransfert_daaf);
            $scope.vm.alltransfert_daaf.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_transfert = parseInt(vm.selectedItemTransfert_daaf.montant_transfert) ;
            item.frais_bancaire = parseInt(vm.selectedItemTransfert_daaf.frais_bancaire) ;
            item.montant_total = parseInt(vm.selectedItemTransfert_daaf.montant_total );
            item.observation = vm.selectedItemTransfert_daaf.observation ;
            item.date = new Date(vm.selectedItemTransfert_daaf.date);
        };

        //fonction bouton suppression item Transfert_daaf convention cisco feffi
        vm.supprimerTransfert_daaf = function()
        {
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                vm.ajoutTransfert_daaf(vm.selectedItemTransfert_daaf,1);
              }, function() {
                //alert('rien');
              });
              vm.stepTwo = false;
              vm.stepThree = false;
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTransfert_daaf (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.alltransfert_daaf.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_daaf.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemTransfert_daaf.observation)
                    || (convT[0].date!=currentItemTransfert_daaf.date)
                    || (convT[0].montant_transfert!=currentItemTransfert_daaf.montant_transfert)
                    || (convT[0].frais_bancaire!=currentItemTransfert_daaf.frais_bancaire)
                    || (convT[0].montant_total!=currentItemTransfert_daaf.montant_total))                    
                      {
                          insert_in_baseTransfert_daaf(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTransfert_daaf(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTransfert_daaf(transfert_daaf,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_daaf ==false)
            {
                getId = vm.selectedItemTransfert_daaf.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    montant_transfert:    transfert_daaf.montant_transfert,
                    frais_bancaire:    transfert_daaf.frais_bancaire,
                    montant_total: transfert_daaf.montant_total,
                    observation: transfert_daaf.observation,
                    date: convertionDate(new Date(transfert_daaf.date)), 
                    id_demande_rea_feffi: vm.selectedItemDemande_realimentation.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("transfert_daaf/index",datas, config).success(function (data)
            {

                if (NouvelItemTransfert_daaf == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        
                        vm.selectedItemTransfert_daaf.$selected  = false;
                        vm.selectedItemTransfert_daaf.$edit      = false;
                        vm.selectedItemTransfert_daaf ={};
                    }
                    else 
                    {    
                      vm.alltransfert_daaf = vm.alltransfert_daaf.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTransfert_daaf.id;
                      });
                      vm.showbuttonNouvTransfert_daaf = true;
                    }
                }
                else
                {
                  
                  transfert_daaf.id  =   String(data.response);              
                  NouvelItemTransfert_daaf = false;

                  vm.showbuttonNouvTransfert_daaf = false;
            }
              transfert_daaf.$selected = false;
              transfert_daaf.$edit = false;
              vm.selectedItemTransfert_daaf = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }

        vm.changeFraibancaire = function(item)
        {
          item.montant_total = parseInt(item.montant_transfert) + parseInt(item.frais_bancaire);
        }

  /*****************Fin StepFor transfert_daaf****************/ 


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

        //convertion date au format AAAA-MM-JJ
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
    }

/*****************Debut ConventionDialogue Controlleur  ****************/    
    function ConventionDialogController($mdDialog, $scope, apiFactory, $state,datatopass)
    { 
        var dg=$scope;
        dg.allconventionDialog = [];

        dg.conventiondialog_column = [
        {titre:"Cisco"},
        {titre:"Feffi"},
        {titre:"Objet"},
        {titre:"Numero convention"},        
        {titre:"Financement"},
        {titre:"Delai"},
        {titre:"Date signature"}];

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getOne("convention_cisco_feffi_entete/index",datatopass.convention_cife_entete.id).then(function(result)
        {dg.allconventionDialog = result.data.response;});

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        //format date affichage sur datatable
        dg.formatDate = function (daty)
        {
            if (daty) 
            {
                var date  = new Date(daty);
                var mois  = date.getMonth()+1;
                var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
                return dates;
            }           

        }

    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
