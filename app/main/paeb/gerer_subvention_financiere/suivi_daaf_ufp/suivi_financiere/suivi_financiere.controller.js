(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_financiere.suivi_daaf_ufp.suivi_financiere')
        .controller('Suivi_financiereController', Suivi_financiereController);
    /** @ngInject */
    function Suivi_financiereController($mdDialog, $scope, apiFactory, $state)
    {
		    var vm    = this;

    //initialisation onvention_daaf_ufp  
        //vm.ajoutConvention_daaf_ufp  = ajoutConvention_daaf_ufp ;
        //var NouvelItemConvention_daaf_ufp    = false;
        //var currentItemConvention_daaf_ufp;
        vm.selectedItemConvention_daaf_ufp      = {} ;
        vm.allconvention_daaf_ufp  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree          = false;

    //initialisation demande_deblocage_daff
        vm.ajoutDemande_deblocage  = ajoutDemande_deblocage ;
        var NouvelItemDemande_deblocage    = false;     
        var currentItemDemande_deblocage;
        vm.selectedItemDemande_deblocage = {} ;
        vm.alldemande_deblocage  = [] ;

    //initialisation transfert_ufp
        vm.ajoutTransfert_ufp  = ajoutTransfert_ufp ;
        var NouvelItemTransfert_ufp    = false;     
        var currentItemTransfert_ufp;
        vm.selectedItemTransfert_ufp = {} ;
        vm.alltransfert_ufp  = [] ;     

        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };
/*****************Debut StepOne convention_daff_ufp****************/

  //col table
        vm.convention_daff_ufp_column = [        
        {titre:"Objet"},
        {titre:"Numero convention"},
        {titre:"Montant estime"},
        {titre:"Date"}];

  //recuperation donnée convention_daff_ufp
        apiFactory.getAll("convention_daff_ufp/index").then(function(result)
        {
            vm.allconvention_daff_ufp = result.data.response;
        });

        //fonction selection item region
        vm.selectionConvention_daff_ufp= function (item)
        {
            vm.selectedItemConvention_daaf_ufp = item;
            vm.stepOne = true;
            vm.stepTwo = false;
            vm.stepThree = false;
            
            //recuperation donnée demande deblocage
            apiFactory.getAPIgeneraliserREST("demande_deblocage_daaf/index",'id_convention_ufpdaaf',vm.selectedItemConvention_daaf_ufp.id).then(function(result)
            {
                vm.alldemande_deblocage = result.data.response;                  
            });
           
        };
        $scope.$watch('vm.selectedItemConvention_daaf_ufp', function()
        {
            if (!vm.allconvention_daff_ufp) return;
            vm.allconvention_daff_ufp.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_daaf_ufp.$selected = true;
        });

  /*****************Fin StepOne convention_daff_ufp****************/  

  /*****************Debut StepTwo demande_deblocage_daff****************/

      vm.demande_deblocage_column = [
        {titre:"Objet"},
        {titre:"Tranche"},
        {titre:"Numero compte"},
        {titre:"Montant"},
        {titre:"Cumul"},
        {titre:"Antérieur"},
        {titre:"Periode"},
        {titre:"Pourcentage"},
        {titre:"Reste à décaisser"},
        {titre:"Date approbation"},
        {titre:"Action"}];

        //Masque de saisi ajout
        vm.ajouterDemande_deblocage = function ()
        { console.log('ee');
          if (NouvelItemDemande_deblocage == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              objet: '',
              tranche: '',         
              numero_compte: '',
              cumul: '',
              anterieur: '',
              periode: '',
              pourcentage:'',
              reste:''
            };         
            vm.alldemande_deblocage.push(items);
            vm.alldemande_deblocage.forEach(function(dem)
            {
              if(dem.$selected==true)
              {
                vm.selectedItemDemande_deblocage = dem;
              }
            });

            NouvelItemDemande_deblocage = true ;
          }else
          {
            vm.showAlert('Ajout demande_deblocage','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutDemande_deblocage(demande_deblocage,suppression)
        {
            if (NouvelItemDemande_deblocage==false)
            {
                test_existanceDemande_deblocage (demande_deblocage,suppression); 
            } 
            else
            {
                insert_in_baseDemande_deblocage(demande_deblocage,suppression);
            }
        }

        //fonction de bouton d'annulation demande_deblocage
        vm.annulerDemande_deblocage = function(item)
        {
          if (NouvelItemDemande_deblocage == false)
          {
            item.$edit     = false;
            item.$selected = false;
            item.objet = currentItemDemande_deblocage.objet ;
            item.id_tranche = currentItemDemande_deblocage.id_tranche ;
            item.id_compte_daaf = currentItemDemande_deblocage.id_compte_daaf ;
            item.cumul = currentItemDemande_deblocage.cumul ;
            item.anterieur = currentItemDemande_deblocage.anterieur ;
            item.periode = currentItemDemande_deblocage.periode ;
            item.pourcentage = currentItemDemande_deblocage.pourcentage ;
            item.reste = currentItemDemande_deblocage.reste ;
            item.numero_compte = currentItemDemande_deblocage.numero_compte ;  
          }else
          {
            vm.allDemande_deblocage = vm.allDemande_deblocage.filter(function(obj)
            {
                return obj.id !== vm.selectedItemDemande_deblocage.id;
            });
          }

          vm.selectedItemDemande_deblocage = {} ;
          NouvelItemDemande_deblocage      = false;
          
        };

        //fonction selection item region
        vm.selectionDemande_deblocage= function (item)
        {
            vm.selectedItemDemande_deblocage = item;
            vm.NouvelItemDemande_deblocage   = item;
            currentItemDemande_deblocage     = JSON.parse(JSON.stringify(vm.selectedItemDemande_deblocage));
            
            //recuperation donnée transfert ufp
            apiFactory.getAPIgeneraliserREST("transfert_ufp/index",'id_demande_deblo_daaf',vm.selectedItemDemande_deblocage.id).then(function(result)
            {
                vm.alltransfert_ufp = result.data.response;                  
            });
            vm.stepTwo = true;
            vm.stepThree = false; 
        };
        $scope.$watch('vm.selectedItemDemande_deblocage', function()
        {
             if (!vm.alldemande_deblocage) return;
             vm.alldemande_deblocage.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemDemande_deblocage.$selected = true;
        });

        //fonction masque de saisie modification item convention
        vm.modifierDemande_deblocage = function(item)
        {
            NouvelItemDemande_deblocage = false ;
            vm.selectedItemDemande_deblocage = item;
            currentItemDemande_deblocage = angular.copy(vm.selectedItemDemande_deblocage);
            $scope.vm.alldemande_deblocage.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.objet = vm.selectedItemDemande_deblocage.objet ;
            item.id_tranche = vm.selectedItemDemande_deblocage.id_tranche ;
            item.id_compte_daaf = vm.selectedItemDemande_deblocage.id_compte_daaf ;
            item.cumul = vm.selectedItemDemande_deblocage.cumul ;
            item.anterieur = vm.selectedItemDemande_deblocage.anterieur ;
            item.periode = vm.selectedItemDemande_deblocage.periode ;
            item.pourcentage = vm.selectedItemDemande_deblocage.pourcentage ;
            item.reste = vm.selectedItemDemande_deblocage.reste ;
            item.numero_compte = vm.selectedItemDemande_deblocage.numero_compte ; 
              
        };

        //fonction bouton suppression item convention
        vm.supprimerDemande_deblocage = function()
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
                vm.ajoutDemande_deblocage(vm.selectedItemDemande_deblocage,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existanceDemande_deblocage (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alldemande_deblocage.filter(function(obj)
                {
                   return obj.id == currentItemDemande_deblocage.id;
                });
                if(dema[0])
                {
                   if((dema[0].objet != currentItemDemande_deblocage.objet )
                    || (dema[0].id_tranche != currentItemDemande_deblocage.id_tranche )
                    || (dema[0].id_compte_daaf != currentItemDemande_deblocage.id_compte_daaf )
                    || (dema[0].cumul != currentItemDemande_deblocage.cumul )
                    || (dema[0].anterieur != currentItemDemande_deblocage.anterieur )
                    || (dema[0].periode != currentItemDemande_deblocage.periode )
                    || (dema[0].pourcentage != currentItemDemande_deblocage.pourcentage )
                    || (dema[0].reste != currentItemDemande_deblocage.reste )
                    || (dema[0].numero_compte != currentItemDemande_deblocage.numero_compte ))                    
                      { 
                        insert_in_baseDemande_deblocage(item,suppression);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseDemande_deblocage(item,suppression);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention
        function insert_in_baseDemande_deblocage(demande_deblocage,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemDemande_deblocage==false)
            {
                getId = vm.selectedItemDemande_deblocage.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,                    
                    objet: demande_deblocage.objet ,
                    id_tranche: demande_deblocage.id_tranche ,
                    id_compte_daaf: demande_deblocage.id_compte_daaf ,
                    cumul: demande_deblocage.cumul ,
                    anterieur: demande_deblocage.anterieur ,
                    periode: demande_deblocage.periode ,
                    pourcentage: demande_deblocage.pourcentage ,
                    reste: demande_deblocage.reste ,
                    numero_compte: demande_deblocage.numero_compte ,
                    id_convention_ufpdaaf: vm.selectedItemConvention_daaf_ufp.id ,
                    validation: 0               
                });
                //console.log(demande_deblocage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("demande_deblocage_daaf/index",datas, config).success(function (data)
            {
                if (NouvelItemDemande_deblocage == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemDemande_deblocage.objet = demande_deblocage.objet ;
                        vm.selectedItemDemande_deblocage.id_tranche = demande_deblocage.id_tranche ;
                        vm.selectedItemDemande_deblocage.id_compte_daaf = demande_deblocage.id_compte_daaf ;
                        vm.selectedItemDemande_deblocage.cumul = demande_deblocage.cumul ;
                        vm.selectedItemDemande_deblocage.anterieur = demande_deblocage.anterieur ;
                        vm.selectedItemDemande_deblocage.periode = demande_deblocage.periode ;
                        vm.selectedItemDemande_deblocage.pourcentage = demande_deblocage.pourcentage ;
                        vm.selectedItemDemande_deblocage.reste = demande_deblocage.reste ;
                        vm.selectedItemDemande_deblocage.numero_compte = demande_deblocage.numero_compte ;

                        vm.selectedItemDemande_deblocage.$selected  = false;
                        vm.selectedItemDemande_deblocage.$edit      = false;
                        vm.selectedItemDemande_deblocage ={};
                    }
                    else 
                    {    
                      vm.alldemande_deblocage = vm.alldemande_deblocage.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemDemande_deblocage.id;
                      });
                    }
                }
                else
                {
                  demande_deblocage.objet = demande_deblocage.objet ;
                  demande_deblocage.id_tranche = demande_deblocage.id_tranche ;
                  demande_deblocage.numero_compte = demande_deblocage.numero_compte ;
                  demande_deblocage.cumul = demande_deblocage.cumul ;
                  demande_deblocage.anterieur = demande_deblocage.anterieur ;
                  demande_deblocage.periode = demande_deblocage.periode ;
                  demande_deblocage.pourcentage = demande_deblocage.pourcentage ;
                  demande_deblocage.reste = demande_deblocage.reste ;
                  demande_deblocage.numero_compte = demande_deblocage.numero_compte ;

                  demande_deblocage.id  =   String(data.response);              
                  NouvelItemDemande_deblocage=false;
            }
              demande_deblocage.$selected = false;
              demande_deblocage.$edit = false;
              vm.selectedItemDemande_deblocage = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepTwo demande_deblocage_daff****************/

  /*****************Fin StepThree transfert_ufp****************/

  vm.transfert_ufp_column = [
        {titre:"Description"},
        {titre:"Montant à communauté"},
        {titre:"Frais banquaire"},
        {titre:"Montant total"},
        {titre:"Numero facture"},
        {titre:"Date"},
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
              description: '',
              montant_communaute:'',
              frais_banquaire:'',
              montant_total:'',
              num_facture:'',
              date: ''
            };         
            vm.alltransfert_ufp.push(items);
            vm.alltransfert_ufp.forEach(function(dem)
            {
              if(dem.$selected==true)
              {
                vm.selectedItemTransfert_ufp = dem;
              }
            });

            NouvelItemTransfert_ufp = true ;
          }else
          {
            vm.showAlert('Ajout transfert_ufp','Un formulaire d\'ajout est déjà ouvert!!!');
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
            item.$edit     = false;
            item.$selected = false;
            item.description = currentItemTransfert_ufp.description ;
            item.montant_communaute     = currentItemTransfert_ufp.montant ;
            item.frais_banquaire = currentItemTransfert_ufp.frais_banquaire ;
            item.montant_total        = currentItemTransfert_ufp.montant_total ;
            item.num_facture = currentItemTransfert_ufp.num_facture ;
            item.date        = currentItemTransfert_ufp.date ;  
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

        //fonction selection item transfert_ufp
        vm.selectionTransfert_ufp= function (item)
        {
            vm.selectedItemTransfert_ufp = item;
            vm.NouvelItemTransfert_ufp   = item;
            currentItemTransfert_ufp     = JSON.parse(JSON.stringify(vm.selectedItemTransfert_ufp));
            vm.stepThree          = true;
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

        //fonction masque de saisie modification item transfert_ufp
        vm.modifierTransfert_ufp = function(item)
        {
            NouvelItemTransfert_ufp = false ;
            vm.selectedItemTransfert_ufp = item;
            currentItemTransfert_ufp = angular.copy(vm.selectedItemTransfert_ufp);
            $scope.vm.alltransfert_ufp.forEach(function(dema) {
              dema.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.description = vm.selectedItemTransfert_ufp.description ;
            item.montant_communaute = vm.selectedItemTransfert_ufp.montant_communaute ;
            item.frais_banquaire = vm.selectedItemTransfert_ufp.frais_banquaire ;
            item.montant_total = vm.selectedItemTransfert_ufp.montant_total ;
            item.num_facture = parseInt(vm.selectedItemTransfert_ufp.num_facture);
            item.date       = vm.selectedItemTransfert_ufp.date ;  
        };

        //fonction bouton suppression item transfert_ufp
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
                vm.ajout(vm.selectedItemTransfert_ufp,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention
        function test_existanceTransfert_ufp (item,suppression)
        {          
            if (suppression!=1)
            {
               var dema = vm.alltransfert_ufp.filter(function(obj)
                {
                   return obj.id == currentItemTransfert_ufp.id;
                });
                if(dema[0])
                {
                   if((dema[0].description!=currentItemTransfert_ufp.description) 
                    || (dema[0].montant_communaute!=currentItemTransfert_ufp.montant_communaute)
                    || (dema[0].frais_banquaire!=currentItemTransfert_ufp.frais_banquaire)
                    || (dema[0].num_facture!=currentItemTransfert_ufp.num_facture)
                    || (dema[0].date!=currentItemTransfert_ufp.date))                    
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

        //insertion ou mise a jours ou suppression item dans bdd transfert_ufp
        function insert_in_baseTransfert_ufp(transfert_ufp,suppression)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemTransfert_ufp==false)
            {
                getId = vm.selectedItemTransfert_ufp.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    description:  transfert_ufp.description,
                    montant_communaute:      transfert_ufp.montant_communaute,
                    frais_banquaire:  transfert_ufp.frais_banquaire,
                    num_facture:  transfert_ufp.num_facture,
                    date: convertionDate(new Date(transfert_ufp.date)),
                    id_demande_deblo_daaf:   vm.selectedItemDemande_deblocage.id,
                    validation: 0               
                });
                //console.log(demande_deblocage.pays_id);
                console.log(datas);
                //factory
            apiFactory.add("transfert_ufp/index",datas, config).success(function (data)
            {
                if (NouvelItemTransfert_ufp == false)
                {
                    // Update or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemTransfert_ufp.description = transfert_ufp.description;
                        vm.selectedItemTransfert_ufp.montant_communaute     = transfert_ufp.montant_communaute;
                        vm.selectedItemTransfert_ufp.frais_banquaire = transfert_ufp.frais_banquaire;
                        vm.selectedItemTransfert_ufp.num_facture = transfert_ufp.num_facture;
                        vm.selectedItemTransfert_ufp.date     = transfert_ufp.date;
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
                    }
                }
                else
                {
                  transfert_ufp.description = transfert_ufp.description;
                  transfert_ufp.montant_communaute = transfert_ufp.montant_communaute;
                  transfert_ufp.frais_banquaire = transfert_ufp.frais_banquaire;
                  transfert_ufp.num_facture = transfert_ufp.num_facture;
                  transfert_ufp.date        = transfert_ufp.date;
                  transfert_ufp.id  =   String(data.response);              
                  NouvelItemTransfert_ufp=false;
            }
              transfert_ufp.$selected = false;
              transfert_ufp.$edit = false;
              vm.selectedItemTransfert_ufp = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

  /*****************Fin StepThree transfert_ufp****************/       

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
