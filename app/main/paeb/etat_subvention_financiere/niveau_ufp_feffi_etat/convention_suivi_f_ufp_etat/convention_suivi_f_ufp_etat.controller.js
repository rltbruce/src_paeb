
(function ()
{
    'use strict';

    angular
        .module('app.paeb.etat_subvention_financiere.niveau_ufp_feffi_etat.convention_suivi_f_ufp_etat')        
        .controller('Convention_suivi_f_ufp_etatController', Convention_suivi_f_ufp_etatController);
    /** @ngInject */
    function Convention_suivi_f_ufp_etatController($mdDialog, $scope, apiFactory, $state,$cookieStore,apiUrl,$http,apiUrlFile,apiUrlexcel)
    {
		  /*****debut initialisation*****/

        var vm    = this;
        vm.datenow = new Date();
        vm.selectedItemConvention_entete = {} ;
        vm.allconvention_entete = [] ;       
        
        vm.stepMenu_feffi=false;
        vm.steppiecefeffi=false;
        vm.steptransufp=false;

        vm.session = '';
        vm.affiche_load =false;

/*******************************Debut initialisation suivi financement feffi******************************/ 
        
        vm.selectedItemDemande_realimentation = {} ;
        vm.alldemande_realimentation  = [] ;
        vm.alldemande_realimentation_invalide  = [] ;
        vm.validation = 0;

        vm.roles = [];
        vm.nbr_demande_feffi_emiufp=0;
        vm.nbr_demande_feffi_encourufp=0;

        vm.selectedItemPiece_justificatif_feffi = {} ;
        vm.allpiece_justificatif_feffi  = [] ;
        
        vm.showbuttonValidationenrejeufp = false;
        vm.showbuttonValidationencourufp = false;        
        vm.showbuttonValidationufp = false;       

        var NouvelItemTransfert_ufp = false;
        var currentItemTransfert_ufp;
        vm.selectedItemTransfert_ufp = {} ;
        vm.alltransfert_ufp=[];

/*******************************Fin initialisation suivi financement feffi******************************/     

/*******************************************Debut maitrise d'oeuvre*************************************/        
       
        vm.selectedItemContrat_moe = {} ;
        vm.allcontrat_moe = [] ;

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
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


        
        apiFactory.getAll("region/index").then(function success(response)
        {
          vm.regions = response.data.response;
        }, function error(response){ alert('something went wrong')});

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
            vm.filtre.id_ecole = null;
            if (item.id_commune != '*')
            {
                apiFactory.getAPIgeneraliserREST("ecole/index","menus","getecoleBycommune","id_commune",item.id_commune).then(function(result)
              {
                vm.ecoles = result.data.response;
                console.log(vm.ecoles);
              }, function error(result){ alert('something went wrong')});
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
            if (utilisateur.roles.indexOf("UFP")!= -1)
            {
                            vm.usercisco = result.data.response.cisco;                            
                            
                            vm.session = 'UFP'; 
            }
            else
            {
                            vm.usercisco = result.data.response.cisco;                             
                            
                            vm.session = 'ADMIN';
              
            }                  

         });

        /***************debut convention cisco/feffi**********/

        vm.convention_entete_column = [
        {titre:"Cisco"
        },
        {titre:"Feffi"
        },
        {titre:"Site"
        },
        {titre:"Accès"
        },
        {titre:"Reference convention"
        },
        {titre:"Objet"
        },
        {titre:"Reference Financement"
        },
        {titre:"Cout éstimé"
        },
       /* {titre:"Avancement"
        },*/
        {titre:"Utilisateur"
        }]; 
       

        vm.recherchefiltre = function(filtre)
        {
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);
            vm.affiche_load =true;
            apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalideufpBydate','date_debut',date_debut,'date_fin',date_fin,'lot',filtre.lot,'id_region',filtre.id_region
            ,'id_cisco',filtre.id_cisco,'id_commune',filtre.id_commune,'id_ecole',filtre.id_ecole,'id_convention_entete',filtre.id_convention_entete).then(function(result)
          {
              vm.allconvention_entete = result.data.response;
              vm.affiche_load =false;
              console.log(vm.allconvention_entete);
          });
        }
        
        /***************fin convention cisco/feffi************/

         //fonction selection item entete convention cisco/feffi
        vm.selectionConvention_entete = function (item)
        {
            vm.selectedItemConvention_entete = item;
            vm.stepMenu_feffi=true;
                          
              vm.steppiecefeffi=false;
              vm.steptransufp=false;
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
        vm.step_menu_demande = function()
        {
          vm.affiche_load =true;
          vm.steppiecefeffi=false;
          vm.steptransufp=false;
          vm.showbuttonValidationencourufp = false;
          vm.showbuttonValidationufp = false;
          vm.showbuttonValidationenrejeufp = false;
          apiFactory.getAPIgeneraliserREST("demande_realimentation_feffi/index","menu","getdemandevalideByconvention",'id_convention_cife_entete',vm.selectedItemConvention_entete.id).then(function(result)
          {
              vm.alldemande_realimentation_invalide = result.data.response;
            vm.affiche_load =false;
          });
        }
                     

/*****************Debut StepTwo demande_realimentation_feffi****************/

      vm.demande_realimentation_column = [                
        {titre:"Tranche"},
        {titre:"Prévu"},
        {titre:"Antérieur"},
        {titre:"Cumul"},
        {titre:"Calendrier de paiement"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Nom banque"},
        {titre:"Numero compte"},
        {titre:"Date"},
        {titre:"Situation"}];     
        
        //fonction ajout dans bdd
             //fonction selection item region
        vm.selectionDemande_realimentation= function (item)
        {
            vm.selectedItemDemande_realimentation = item;
            vm.showbuttonNouvtransfert_ufp = true;               
            vm.validation = item.validation;
            vm.steppiecefeffi=true;
            vm.steptransufp=true;
                
            vm.showbuttonValidationenrejeufp = true;
            vm.showbuttonValidationencourufp = true;        
            vm.showbuttonValidationufp = true;
         console.log(vm.steptransufp);
         console.log(vm.validation);
        };
        $scope.$watch('vm.selectedItemDemande_realimentation', function()
        {
             if (!vm.alldemande_realimentation_invalide) return;
             vm.alldemande_realimentation_invalide.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_realimentation.$selected = true;
        });

    

        vm.situationdemande = function(validation)
        {
            switch (validation)
            {
              case '1':
                      return 'Validée par DPFI';                  
                  break;

             case '2':
                  
                  return 'Rejetée par UFP'; 
                  break;
              case '3':                  
                  return 'Validée par UFP'; 
                  break;
             
             case '5':                  
                  return 'Validée par DPFI'; 
                  break;
             case '6':                  
                  return 'Rejetée par DAAF'; 
                  break;
              case '7':                  
                  return 'Validée par DAAF'; 
                  break;
              
              default:
                  break;
          
            }
        }
      
  
  /*************************Fin StepTwo demande_realimentation_feffi***************************************/


  /*********************************Fin StepThree piece_justificatif_feffi*******************************/
  vm.step_justificatif = function()
    {   
        vm.affiche_load =true;
        apiFactory.getAPIgeneraliserREST("piece_justificatif_feffi/index",'id_demande_rea_feffi',vm.selectedItemDemande_realimentation.id,'id_tranche',vm.selectedItemDemande_realimentation.tranche.id).then(function(result)
        {
            vm.allpiece_justificatif_feffi = result.data.response;
            vm.affiche_load =false;
        });
    }

        vm.piece_justificatif_feffi_column = [
        {titre:"Description"},
        {titre:"Fichier"},
        {titre:"Action"}];

   

        //fonction selection item Piece_justificatif_feffi
        vm.selectionPiece_justificatif_feffi= function (item)
        {
            vm.selectedItemPiece_justificatif_feffi = item;
           // vm.allconvention_cisco_feffi_entete= [] ; 
        };
        $scope.$watch('vm.selectedItemPiece_justificatif_feffi', function()
        {
             if (!vm.allpiece_justificatif_feffi) return;
             vm.allpiece_justificatif_feffi.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPiece_justificatif_feffi.$selected = true;
        });
           
         vm.download_piece_justificatif = function(item)
        {//console.log(item.fichier);
            window.open(apiUrlFile+item.fichier);
        }


  /**********************************Fin StepThree piece_justificatif_feffi****************************/


  /*************************************debut StepThree transfert ufp********************************/
          //col table
            vm.transfert_ufp_column = [
            {titre:"Montant transféré"},        
            {titre:"Frais bancaire"},
            {titre:"Montant total"},
            {titre:"Date"},
            {titre:"Situation"},
            {titre:"Observation"}];

            vm.step_transfert_ufp = function()
            {   
                vm.affiche_load =true;
                vm.showbuttonValidation_trans_ufp = false;
                apiFactory.getAPIgeneraliserREST("transfert_daaf/index",'menu','gettransfervalideBydemande','id_demande_rea_feffi',vm.selectedItemDemande_realimentation.id).then(function(result)
                {
                    vm.alltransfert_ufp = result.data.response;
                    vm.affiche_load =false;
                });
            }

           
            //fonction selection item Transfert_ufp convention cisco/feffi
            vm.selectionTransfert_ufp = function (item)
            {
                vm.selectedItemTransfert_ufp = item;
                vm.validation_transfert_ufp  = item.validation;          

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

            

        vm.affichage_trans =function(situation)
        {
          var affichage = 'En attente';
          if (situation == 1)
          {
            var affichage = 'Transferé';
          }
          return affichage;
        }
        
  /**********************************Fin StepThree transfert ufp***********************************/
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
