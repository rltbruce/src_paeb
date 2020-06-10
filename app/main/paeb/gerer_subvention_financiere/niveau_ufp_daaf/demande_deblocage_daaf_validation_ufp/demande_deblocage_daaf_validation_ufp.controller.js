(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.niveau_ufp_daaf.demande_deblocage_daaf_validation_ufp')
        .controller('Demande_deblocage_daaf_validation_ufpController', Demande_deblocage_daaf_validation_ufpController)
    /** @ngInject */
    function Demande_deblocage_daaf_validation_ufpController($mdDialog, $scope, apiFactory, $state,loginService,apiUrl,$http,apiUrlFile)
    {
		    var vm    = this;

    //initialisation
        vm.stepOne   = false;
        vm.stepTwo   = false;
        vm.stepThree = false;

      //initialisation convention_ufp_daaf_entete
        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;

     //initialisation demande_deblocage_daaf_validation_ufp
        var NouvelItemDemande_deblocage_daaf_validation_ufp    = false;
        vm.selectedItemDemande_deblocage_daaf_validation_ufp = {} ;
        vm.alldemande_deblocage_daaf_valide_daaf  = [] ;

    //initialisation justificatif_daaf
        vm.selectedItemJustificatif_daaf = {} ;
        vm.alljustificatif_daaf = [] ;
        //vm.situation = 5;
        vm.showbutton = false;

        var NouvelItemTransfert_ufp = false;
        var currentItemTransfert_ufp;
        vm.selectedItemTransfert_ufp = {} ;
        vm.ajoutTransfert_ufp  = ajoutTransfert_ufp ;
        vm.alltransfert_ufp = [] ;
        vm.showbuttonNouvtransfert= true;

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        }; 
        
        apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemande_deblocage_daaf_invalide","validation",1).then(function(result)
        {
            vm.alldemande_deblocage_daaf_valide_daaf = result.data.response;
            
        });

        vm.showformfiltre = function()
        {
          vm.showbuttonfiltre=false;
          vm.showfiltre=true;
        }

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);

              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionByfiltre',
              'date_debut',date_debut,'date_fin',date_fin).then(function(result)
              {
                  vm.allconvention_ufp_daaf_entete = result.data.response; 
                  console.log(vm.allconvention_ufp_daaf_entete);
              });
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
            vm.showbuttonfiltre=true;
            vm.showfiltre=false;
        }

         /*****************Debut StepOne convention_ufp_daaf_entete***************/

  //recuperation donnée convention_ufp_daaf_entete
       apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','getconventionBydemandevalidedaaf').then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
            console.log(vm.allconvention_ufp_daaf_entete);
        });

        //col table
        vm.convention_ufp_daaf_entete_column = [
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Montant convention"},        
        {titre:"Numero vague"},        
        {titre:"Nombre bénéficiaire"}
        ];
        
        

        //fonction selection item convetion
        vm.selectionConvention_ufp_daaf_entete = function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;           
            
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;

           //recuperation donnée demande
            apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index","menu","getdemandedisponible","id_convention_ufp_daaf_entete",item.id).then(function(result)
            {
                vm.alldemande_deblocage_daaf_valide_daaf = result.data.response; 
                console.log(vm.alldemande_deblocage_daaf_valide_daaf );
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_entete', function()
        {
             if (!vm.allconvention_ufp_daaf_entete) return;
             vm.allconvention_ufp_daaf_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_ufp_daaf_entete.$selected = true;

        });             

  /*****************Fin StepOne convention_ufp_daaf_entete****************/

  /*****************Debut StepTwo demande_deblocage_daaf_validation_ufp****************/

      vm.demande_deblocage_daaf_validation_ufp_column = [
        {titre:"Réference demande"},
        {titre:"Objet"},       
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"}];        

        //fonction selection item region
        vm.selectionDemande_deblocage_daaf_validation_ufp= function (item)
        {
            vm.selectedItemDemande_deblocage_daaf_validation_ufp = item;
           //recuperation donnée demande_deblocage_daaf_validation_ufp
            apiFactory.getAPIgeneraliserREST("justificatif_daaf/index",'id_demande_deblocage_daaf',item.id).then(function(result)
            {
                vm.alljustificatif_daaf = result.data.response;
                console.log(vm.alljustificatif_daaf);
            });
            if (item.validation==3)
            {
              apiFactory.getAPIgeneraliserREST("transfert_ufp/index",'id_demande_deblocage_daaf',item.id).then(function(result)
              {
                  vm.alltransfert_ufp = result.data.response;
                  if (vm.alltransfert_ufp.length >0)
                  {
                    vm.showbuttonNouvtransfert= false;
                  }
              });
            }
            vm.stepTwo = true;
            vm.stepThree = false;
            vm.validation_item = item.validation;
            vm.showbutton =true;
        };
        $scope.$watch('vm.selectedItemDemande_deblocage_daaf_validation_ufp', function()
        {
             if (!vm.alldemande_deblocage_daaf_valide_daaf) return;
             vm.alldemande_deblocage_daaf_valide_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage_daaf_validation_ufp.$selected = true;
        });

        vm.demande_deblocage_daaf_mettreencours = function()
        {
            insert_in_baseDemande_deblocage_daaf_validation_ufp(vm.selectedItemDemande_deblocage_daaf_validation_ufp,0,2);
        }

        vm.demande_deblocage_daaf_finaliser = function()
        {   
            insert_in_baseDemande_deblocage_daaf_validation_ufp(vm.selectedItemDemande_deblocage_daaf_validation_ufp,0,3);
        }
        vm.demande_deblocage_daaf_rejeter = function()
        { 
            insert_in_baseDemande_deblocage_daaf_validation_ufp(vm.selectedItemDemande_deblocage_daaf_validation_ufp,0,4);
        }


        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function insert_in_baseDemande_deblocage_daaf_validation_ufp(demande_deblocage_daaf_validation_ufp,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        demande_deblocage_daaf_validation_ufp.id,
                    ref_demande: demande_deblocage_daaf_validation_ufp.ref_demande ,      
                    id_compte_daaf: demande_deblocage_daaf_validation_ufp.id_compte_daaf ,
                    id_tranche_deblocage_daaf: demande_deblocage_daaf_validation_ufp.tranche.id ,
                    prevu: demande_deblocage_daaf_validation_ufp.prevu ,
                    cumul: demande_deblocage_daaf_validation_ufp.cumul ,
                    anterieur: demande_deblocage_daaf_validation_ufp.anterieur ,
                    reste: demande_deblocage_daaf_validation_ufp.reste ,
                    objet: demande_deblocage_daaf_validation_ufp.objet ,
                    ref_demande: demande_deblocage_daaf_validation_ufp.ref_demande ,
                    date: convertionDate(new Date(demande_deblocage_daaf_validation_ufp.date)) ,
                    validation: validation,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id              
                });
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {                  
                
              vm.selectedItemDemande_deblocage_daaf_validation_ufp.validation = validation;
              
              vm.stepTwo = false;
              vm.stepThree = false;
              vm.showbutton = false;
              //vm.selectedItemDemande_deblocage_daaf_validation_ufp = {};
            }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.situationdemande = function(validation)
        {
            switch (parseInt(validation))
            {
              case 1:
                      return 'Emise';                  
                  break;
              
              case 2:
                        return 'En cours de traitement'; 
                  break;

              case 3:
                  
                  return 'Finalisée'; 
                  break;

             case 4:
                  
                  return 'Rejeté'; 
                  break;

              default:
          
            }
        }

  /*****************Fin StepTwo demande_deblocage_daaf_validation_ufp****************/

  /*****************Fin StepThree justificatif_daaf****************/

  /****************************Debut stepTwo Transfert ufp******************************/
//col table
        vm.transfert_ufp_column = [        
        {titre:"Montant transféré"},        
        {titre:"Frais bancaire"},
        {titre:"Montant total"},
        {titre:"Date"},
        {titre:"Observation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterTransfert_ufp = function ()
        { 
          if (NouvelItemTransfert_ufp == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              montant_transfert: parseInt(vm.selectedItemDemande_deblocage_daaf_validation_ufp.prevu),
              frais_bancaire:'',
              montant_total:'',
              date:'',
              observation:''
            };         
            vm.alltransfert_ufp.push(items);
            vm.alltransfert_ufp.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemTransfert_ufp = conv;
              }
            });

            NouvelItemTransfert_ufp = true ;
          }else
          {
            vm.showAlert('Ajout entête convention','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutTransfert_ufp(transfert_ufp,suppression)
        {
            if (NouvelItemTransfert_ufp==false)
            {
                test_existanceTransfert_ufp (transfert_ufp,suppression); 
            } 
            else
            {
                insert_in_baseTransfert_ufp(transfert_ufp,suppression);
            }
        }

        //fonction de bouton d'annulation transfert_ufp
        vm.annulerTransfert_ufp = function(item)
        {
          if (NouvelItemTransfert_ufp == false)
          {
              item.$edit = false;
              item.$selected = false;
              item.montant_transfert = currentItemTransfert_ufp.montant_transfert;
              item.frais_bancaire = currentItemTransfert_ufp.frais_bancaire;
              item.montant_total = currentItemTransfert_ufp.montant_total;
              item.date = currentItemTransfert_ufp.date;
              item.observation    = currentItemTransfert_ufp.observation;
          }else
          {
            vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
            {
                return obj.id !== vm.selectedItemTransfert_ufp.id;
            });
          }

          vm.selectedItemTransfert_ufp = {} ;
          NouvelItemTransfert_ufp      = false;
          
        };

        //fonction selection item transfert_ufp convention cisco/feffi
        vm.selectionTransfert_ufp = function (item)
        {
            vm.selectedItemTransfert_ufp = item;
            currentItemTransfert_ufp     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_ufp));
           // vm.allconvention= [] ;
           // vm.stepTwo = true;
                        

        };
        $scope.$watch('vm.selectedItemTransfert_ufp', function()
        {
             if (!vm.alltransfert_ufp) return;
             vm.alltransfert_ufp.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemTransfert_ufp.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierTransfert_ufp = function(item)
        {
            NouvelItemTransfert_ufp = false ;
            vm.selectedItemTransfert_ufp = item;
            currentItemTransfert_ufp = angular.copy(vm.selectedItemTransfert_ufp);
            $scope.vm.alltransfert_ufp.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.montant_transfert = parseInt(vm.selectedItemTransfert_ufp.montant_transfert) ;
            item.frais_bancaire = parseInt(vm.selectedItemTransfert_ufp.frais_bancaire) ;
            item.montant_total = parseInt(vm.selectedItemTransfert_ufp.montant_total );
            item.observation = vm.selectedItemTransfert_ufp.observation ;
            item.date = new Date(vm.selectedItemTransfert_ufp.date);
        };

        //fonction bouton suppression item transfert_ufp convention cisco feffi
        vm.supprimerTransfert_ufp = function()
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
                vm.ajoutTransfert_ufp(vm.selectedItemTransfert_ufp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item entente convention cisco feffi
        function test_existanceTransfert_ufp (item,suppression)
        {          
            if (suppression!=1)
            {
               var convT = vm.alltransfert_ufp.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_ufp.id;
                });
                if(convT[0])
                {
                   if((convT[0].observation!=currentItemTransfert_ufp.observation)
                    || (convT[0].date!=currentItemTransfert_ufp.date)
                    || (convT[0].montant_transfert!=currentItemTransfert_ufp.montant_transfert)
                    || (convT[0].frais_bancaire!=currentItemTransfert_ufp.frais_bancaire)
                    || (convT[0].montant_total!=currentItemTransfert_ufp.montant_total))                    
                      {
                          insert_in_baseTransfert_ufp(item,suppression);                        
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseTransfert_ufp(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseTransfert_ufp(transfert_ufp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_ufp ==false)
            {
                getId = vm.selectedItemTransfert_ufp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,      
                    montant_transfert:    transfert_ufp.montant_transfert,
                    frais_bancaire:    transfert_ufp.frais_bancaire,
                    montant_total: transfert_ufp.montant_total,
                    observation: transfert_ufp.observation,
                    date: convertionDate(new Date(transfert_ufp.date)), 
                    id_demande_deblocage_daaf: vm.selectedItemDemande_deblocage_daaf_validation_ufp.id             
                });
                //console.log(datas);
                //factory
            apiFactory.add("transfert_ufp/index",datas, config).success(function (data)
            {

                if (NouvelItemTransfert_ufp == false)
                {
                    // Update_paiement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTransfert_ufp.$selected  = false;
                        vm.selectedItemTransfert_ufp.$edit      = false;
                        vm.selectedItemTransfert_ufp ={};
                    }
                    else 
                    {    
                      vm.alltransfert_ufp = vm.alltransfert_ufp.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemTransfert_ufp.id;
                      });
                      vm.showbuttonNouvtransfert= true;
                      //vm.showbuttonNouvtransfert_ufp = true;
                    }
                }
                else
                {
                  transfert_ufp.id  =   String(data.response);              
                  NouvelItemTransfert_ufp = false;
                  vm.showbuttonNouvtransfert= false;

                  //vm.showbuttonNouvtransfert_ufp = false;
            }
              transfert_ufp.$selected = false;
              transfert_ufp.$edit = false;
              vm.selectedItemTransfert_ufp = {};
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});


        }
        vm.changeFraibancaire = function(item)
        {
          item.montant_total = parseInt(item.montant_transfert) + parseInt(item.frais_bancaire);
        }


  /*****************Fin StepThree Transfert ufp****************/ 

  //col table
        vm.justificatif_daaf_column = [
        {titre:"Description"
        },
        {titre:"Fichier"
        },
        {titre:"Action"
        }];

     

        //fonction selection item justificatif batiment
        vm.selectionJustificatif_daaf= function (item)
        {
            vm.selectedItemJustificatif_daaf = item;
        };
        $scope.$watch('vm.selectedItemJustificatif_daaf', function()
        {
             if (!vm.alljustificatif_daaf) return;
             vm.alljustificatif_daaf.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemJustificatif_daaf.$selected = true;
        });

        vm.DownloadJustificatif_daaf = function(item)
        {
            window.location = apiUrlFile+item.fichier ;
        }

  


  /*****************Fin StepThree justificatif_daaf****************/ 
        

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
})();
