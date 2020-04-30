(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_situation_moe.passation_marches_moe')
        .controller('Passation_marches_moeController', Passation_marches_moeController);
    /** @ngInject */
    function Passation_marches_moeController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm = this;
        vm.selectedItemBureau_etude = {} ;
        vm.allbureau_etude = [] ;

        vm.selectedItemContrat_bureau_etude = {} ;
        vm.allcontrat_bureau_etude = [] ;

        vm.ajoutPassation_marches_moe = ajoutPassation_marches_moe ;
        var NouvelItemPassation_marches_moe=false;
        var currentItemPassation_marches_moe;
        vm.selectedItemPassation_marches_moe = {} ;
        vm.allpassation_marches_moe = [] ;

        vm.allconvention_entete = [] ;

        vm.allbe = [] ;

        vm.stepOne = false;
        vm.stepTwo = false;
        vm.stepThree = false;

        vm.showbuttonNouvPassation=true;
        vm.date_now         = new Date();

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

/**********************************debut bureau etude****************************************/
//col table
        vm.bureau_etude_column = [
        {titre:"Nom"},
        {titre:"Nif"},
        {titre:"Stat"},
        {titre:"Siege"},
        {titre:"telephone"}
        ];

                //recuperation donnée prestataire
        apiFactory.getAll("bureau_etude/index").then(function(result)
        {
            vm.allbureau_etude = result.data.response;
        });

                //fonction selection item bureau etude
        vm.selectionBureau_etude = function (item)
        {
            vm.selectedItemBureau_etude = item;
           // vm.allconvention= [] ;
            
            vm.showbuttonNouvPassation=true;
            //recuperation donnée convention
            if (vm.selectedItemBureau_etude.id!=0)
            { 

              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("contrat_be/index",'menus','getcontratBybe','id_bureau_etude',vm.selectedItemBureau_etude.id).then(function(result)
              {
                  vm.allcontrat_bureau_etude = result.data.response; 
                  console.log(vm.allcontrat_bureau_etude);
              });
              vm.stepOne = true;
              vm.stepTwo = false;
              vm.stepThree = false;
            }           

        };
        $scope.$watch('vm.selectedItemBureau_etude', function()
        {
             if (!vm.allbureau_etude) return;
             vm.allbureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemBureau_etude.$selected = true;
        });
 
/**********************************fin bureau etude****************************************/ 

/**********************************debut contrat bureau etude****************************************/
//col table
        vm.contrat_bureau_etude_column = [
        {titre:"Intitule"
        },
        {titre:"Réference contrat"
        },
        {titre:"montant contrat"
        },
        {titre:"Date signature"
        }];

        vm.selectionContrat_bureau_etude= function (item)
        {
            vm.selectedItemContrat_bureau_etude = item;

           if(item.id!=0)
           {
            vm.stepTwo = true;
            vm.stepThree = false;
              apiFactory.getAPIgeneraliserREST("passation_marches_be/index",'menu','getpassationBycontrat_be','id_contrat_bureau_etude',item.id).then(function(result)
              {
                  vm.allpassation_marches_moe = result.data.response;
                  console.log(vm.allpassation_marches_moe);

                  if (vm.allpassation_marches_moe.length!=0)
                  {
                      vm.showbuttonNouvPassation=false;
                  }
              });
console.log(item);
              apiFactory.getOne("convention_cisco_feffi_entete/index",item.convention_entete.id).then(function(result)
              {
                  vm.allconvention_entete = result.data.response;
                  console.log(vm.allconvention_entete);
              });
           }
             
        };
        $scope.$watch('vm.selectedItemContrat_bureau_etude', function()
        {
             if (!vm.allcontrat_bureau_etude) return;
             vm.allcontrat_bureau_etude.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemContrat_bureau_etude.$selected = true;
        });
/**********************************fin contrat bureau etude****************************************/


/**********************************debut passation_marches_moe****************************************/
        //col table
        vm.passation_marches_moe_column = [
        {titre:"Date shortlist"
        },
        {titre:"Date Appel manifestation"
        },
        {titre:"Date lancement DP"
        },
        {titre:"Date remise"
        },
        {titre:"Nombre plis reçu"
        },
        {titre:"Date rapport evaluation"
        },
        {titre:"Date demande ANO DPFI"
        },
        {titre:"Date ANO DPFI"
        },
        {titre:"Notification intention"
        },
        {titre:"Date notification attribution"
        },
        {titre:"Date signature contrat"
        },
        {titre:"Date OS"
        },
        {titre:"Statut"
        },
        {titre:"Observation"
        },
        {titre:"Action"
        }];
        //Masque de saisi ajout
        vm.ajouterPassation_marches_moe = function ()
        { 
          if (NouvelItemPassation_marches_moe == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              date_shortlist: '',
              date_manifestation: '',         
              date_lancement_dp: '',
              date_remise: '',
              nbr_offre_recu: '',
              date_rapport_evaluation:'',
              date_demande_ano_dpfi: '',
              date_ano_dpfi: '',
              notification_intention: '',
              date_notification_attribution:'',
              date_signature_contrat:'',
              date_os: '',
              id_bureau_etude: '',
              statut: '',
              observation:''
            };         
            vm.allpassation_marches_moe.push(items);
            vm.allpassation_marches_moe.forEach(function(mem)
            {
              if(mem.$selected==true)
              {
                vm.selectedItemPassation_marches_moe = mem;
              }
            });

            NouvelItemPassation_marches_moe = true ;
          }else
          {
            vm.showAlert('Ajout passation_marches_moe','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutPassation_marches_moe(passation_marches_moe,suppression)
        {
            if (NouvelItemPassation_marches_moe==false)
            {
                test_existancePassation_marches_moe (passation_marches_moe,suppression); 
            } 
            else
            {
                insert_in_basePassation_marches_moe(passation_marches_moe,suppression);
            }
        }

        //fonction de bouton d'annulation passation_marches_moe
        vm.annulerPassation_marches_moe = function(item)
        {
          if (NouvelItemPassation_marches_moe == false)
          {
            item.$edit = false;
            item.$selected = false;
            item.observation   = currentItemPassation_marches_moe.observation ;
            item.date_os   = currentItemPassation_marches_moe.date_os ;
            item.date_remise   = currentItemPassation_marches_moe.date_remise ;
            item.date_ano_dpfi = currentItemPassation_marches_moe.date_ano_dpfi ;
            item.nbr_offre_recu = currentItemPassation_marches_moe.nbr_offre_recu;
            item.date_lancement_dp = currentItemPassation_marches_moe.date_lancement_dp ;
            item.date_shortlist   = currentItemPassation_marches_moe.date_shortlist ;
            item.date_manifestation   = currentItemPassation_marches_moe.date_manifestation ;
            item.statut  = currentItemPassation_marches_moe.statut;
            item.id_bureau_etude = currentItemPassation_marches_moe.id_prestataire ;
            item.date_signature_contrat   = currentItemPassation_marches_moe.date_signature_contrat ;
            item.date_demande_ano_dpfi    = currentItemPassation_marches_moe.date_demande_ano_dpfi ;
            item.date_rapport_evaluation  = currentItemPassation_marches_moe.date_rapport_evaluation ;
            item.notification_intention   = currentItemPassation_marches_moe.notification_intention;
            item.date_notification_attribution  = currentItemPassation_marches_moe.date_notification_attribution ;
          }else
          {
            vm.allpassation_marches_moe = vm.allpassation_marches_moe.filter(function(obj)
            {
                return obj.id !== vm.selectedItemPassation_marches_moe.id;
            });
          }

          vm.selectedItemPassation_marches_moe = {} ;
          NouvelItemPassation_marches_moe      = false;
          
        };

        //fonction selection item region
        vm.selectionPassation_marches_moe= function (item)
        {
            vm.selectedItemPassation_marches_moe = item;
            vm.nouvelItemPassation_marches_moe   = item;
            currentItemPassation_marches_moe    = JSON.parse(JSON.stringify(vm.selectedItemPassation_marches_moe));
            //vm.stepTwo = true;
            vm.stepThree = false;
        };
        $scope.$watch('vm.selectedItemPassation_marches_moe', function()
        {
             if (!vm.allpassation_marches_moe) return;
             vm.allpassation_marches_moe.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemPassation_marches_moe.$selected = true;
        });

        //fonction masque de saisie modification item feffi
        vm.modifierPassation_marches_moe = function(item)
        {
            NouvelItemPassation_marches_moe = false ;
            vm.selectedItemPassation_marches_moe = item;
            currentItemPassation_marches_moe = angular.copy(vm.selectedItemPassation_marches_moe);
            $scope.vm.allpassation_marches_moe.forEach(function(mem) {
              mem.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;
            item.observation   = vm.selectedItemPassation_marches_moe.observation ;
            item.date_os   = new Date(vm.selectedItemPassation_marches_moe.date_os)  ;
            item.date_remise   = new Date(vm.selectedItemPassation_marches_moe.date_remise) ;
            item.date_ano_dpfi = new Date(vm.selectedItemPassation_marches_moe.date_ano_dpfi);
            item.nbr_offre_recu = parseInt(vm.selectedItemPassation_marches_moe.nbr_offre_recu);
            item.date_lancement_dp = new Date(vm.selectedItemPassation_marches_moe.date_lancement_dp) ;
            item.date_signature_contrat   = new Date(vm.selectedItemPassation_marches_moe.date_signature_contrat) ;
            item.date_demande_ano_dpfi    = new Date(vm.selectedItemPassation_marches_moe.date_demande_ano_dpfi) ;
            item.date_rapport_evaluation  = new Date(vm.selectedItemPassation_marches_moe.date_rapport_evaluation) ;
            item.notification_intention   = new Date(vm.selectedItemPassation_marches_moe.notification_intention);
            item.date_notification_attribution  = new Date(vm.selectedItemPassation_marches_moe.date_notification_attribution) ;
            item.date_shortlist   = new Date(vm.selectedItemPassation_marches_moe.date_shortlist );
            item.date_manifestation   = new Date(vm.selectedItemPassation_marches_moe.date_manifestation) ;
            item.statut  = vm.selectedItemPassation_marches_moe.statut;
        };

        //fonction bouton suppression item passation_marches_moe
        vm.supprimerPassation_marches_moe = function()
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
                vm.ajoutPassation_marches_moe(vm.selectedItemPassation_marches_moe,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item feffi
        function test_existancePassation_marches_moe (item,suppression)
        {          
            if (suppression!=1)
            {
               var pass = vm.allpassation_marches_moe.filter(function(obj)
                {
                   return obj.id == currentItemPassation_marches_moe.id;
                });
                if(pass[0])
                {
                   if((pass[0].observation   != currentItemPassation_marches_moe.observation )
                    || (pass[0].date_os   != currentItemPassation_marches_moe.date_os )
                    || (pass[0].date_remise   != currentItemPassation_marches_moe.date_remise )
                    || (pass[0].date_ano_dpfi != currentItemPassation_marches_moe.date_ano_dpfi )
                    || (pass[0].nbr_offre_recu != currentItemPassation_marches_moe.nbr_offre_recu)
                    || (pass[0].date_lancement_dp != currentItemPassation_marches_moe.date_lancement_dp )
                    || (pass[0].id_bureau_etude != currentItemPassation_marches_moe.id_bureau_etude ) 
                    || (pass[0].date_signature_contrat   != currentItemPassation_marches_moe.date_signature_contrat )
                    || (pass[0].date_demande_ano_dpfi    != currentItemPassation_marches_moe.date_demande_ano_dpfi )
                    || (pass[0].date_rapport_evaluation  != currentItemPassation_marches_moe.date_rapport_evaluation )
                    || (pass[0].notification_intention   != currentItemPassation_marches_moe.notification_intention)
                    || (pass[0].date_notification_attribution  != currentItemPassation_marches_moe.date_notification_attribution )
                    || (pass[0].date_shortlist  != currentItemPassation_marches_moe.date_shortlist )
                    || (pass[0].date_manifestation   != currentItemPassation_marches_moe.date_manifestation)
                    || (pass[0].statut  != currentItemPassation_marches_moe.statut ) )                   
                      { 
                         insert_in_basePassation_marches_moe(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_basePassation_marches_moe(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd feffi
        function insert_in_basePassation_marches_moe(passation_marches_moe,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemPassation_marches_moe==false)
            {
                getId = vm.selectedItemPassation_marches_moe.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    date_lancement_dp: convertionDate(new Date(passation_marches_moe.date_lancement_dp)),
                    date_os: convertionDate(new Date(passation_marches_moe.date_os)),
                    date_remise: convertionDate(new Date(passation_marches_moe.date_remise)),
                    nbr_offre_recu: passation_marches_moe.nbr_offre_recu,
                    date_rapport_evaluation:convertionDate(new Date(passation_marches_moe.date_rapport_evaluation)),
                    date_demande_ano_dpfi: convertionDate(new Date(passation_marches_moe.date_demande_ano_dpfi)),
                    date_ano_dpfi: convertionDate(new Date(passation_marches_moe.date_ano_dpfi)),
                    notification_intention: convertionDate(new Date(passation_marches_moe.notification_intention)),
                    date_notification_attribution: convertionDate(new Date(passation_marches_moe.date_notification_attribution)),
                    date_signature_contrat: convertionDate(new Date(passation_marches_moe.date_signature_contrat)),
                    id_bureau_etude: passation_marches_moe.id_bureau_etude,
                    date_shortlist: convertionDate(new Date(passation_marches_moe.date_shortlist)),
                    date_manifestation: convertionDate(new Date(passation_marches_moe.date_manifestation)),
                    statut: passation_marches_moe.statut,
                    observation:passation_marches_moe.observation,
                    id_convention_entete: vm.allconvention_entete[0].id              
                });
                console.log(datas);
                //factory
            apiFactory.add("passation_marches_be/index",datas, config).success(function (data)
            {   
                var be= vm.allbe.filter(function(obj)
                {
                    return obj.id == passation_marches_moe.id_bureau_etude;
                });

                if (NouvelItemPassation_marches_moe == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemPassation_marches_moe.be = be[0];
                        vm.selectedItemPassation_marches_moe.$selected  = false;
                        vm.selectedItemPassation_marches_moe.$edit      = false;
                        vm.selectedItemPassation_marches_moe ={};
                        vm.showbuttonNouvPassation= false;
                    }
                    else 
                    {    
                      vm.allpassation_marches_moe = vm.allpassation_marches_moe.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemPassation_marches_moe.id;
                      });
                      vm.showbuttonNouvPassation= true;
                    }
                    
                }
                else
                {
                  passation_marches_moe.be = be[0];

                  passation_marches_moe.id  =   String(data.response);              
                  NouvelItemPassation_marches_moe=false;
                  vm.showbuttonNouvPassation= false;
            }
              passation_marches_moe.$selected = false;
              passation_marches_moe.$edit = false;
              vm.selectedItemPassation_marches_moe = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.affichageStatut= function(statut)
        { var stat= '';
          switch (statut)
            {
              case '1':
                 stat = 'BE';
 
                  break;
              
              case '2':
                   stat = 'CI';
                  break;

              default:
          
            }
         return stat;   
        }
/**********************************fin passation_marches_moe****************************************/

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
