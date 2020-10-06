(function ()
{
    'use strict';

    angular
        .module('app.paeb.gerer_subvention_operation.niveau_ufp_daaf.convention_ufp_daaf')
        .controller('Convention_ufp_daafController', Convention_ufp_daafController)
        .controller('ConventionDialogController', ConventionDialogController);
    /** @ngInject */
    function Convention_ufp_daafController($mdDialog, $scope, apiFactory, $state,$cookieStore,loginService,$timeout)
    {
		    var vm = this;
        vm.affiche_load = false;
    //initialisation convetion ufp/daaf entete 
        vm.ajoutConvention_ufp_daaf_entete = ajoutConvention_ufp_daaf_entete ;
        var NouvelItemConvention_ufp_daaf_entete = false;
        var currentItemConvention_ufp_daaf_entete;
        vm.selectedItemConvention_ufp_daaf_entete = {} ;
        vm.allconvention_ufp_daaf_entete  = [] ;
        vm.stepOne           = false;
        vm.stepTwo           = false;
        vm.stepThree         = false;
        vm.afficherboutonValider = false;
        vm.permissionboutonValider = false;
        

      //initialisation convetion ufp/daaf detail  
        vm.ajoutConvention_ufp_daaf_detail = ajoutConvention_ufp_daaf_detail ;
        var NouvelItemConvention_ufp_daaf_detail = false;
        var currentItemConvention_ufp_daaf_detail;
        vm.selectedItemConvention_ufp_daaf_detail = {} ;
        vm.allconvention_ufp_daaf_detail  = [] ; 
        vm.showbuttonNouvDetail = true;
        vm.allcompte_daaf  = [] ; 

    //initialisation convention
        vm.selectedItemConvention_cisco_feffi_entete = {} ;
        var currentItemConvention_cisco_feffi_entete;
        var NouvelItemConvention_cisco_feffi_entete = false;
        vm.allconvention_cisco_feffi_entete = [] ;

        vm.date_now = new Date();     

        vm.showbuttonfiltre=true;
        vm.showfiltre=false;
        //style
        vm.dtOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso = {
          dom: '<"top">rt<"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        //style
        vm.dtOptionsperso2 = {
          dom: '<"top"><"bottom"<"left"<"length">><"right"<"info"><"pagination">>>',
          pagingType: 'simple',
          autoWidth: false          
        };

         /*var id_user = $cookieStore.get('id');

        apiFactory.getOne("utilisateurs/index", id_user).then(function(result)             
        {
            //var roles = result.data.response.roles;

            var roles = result.data.response.roles.filter(function(obj)
            {
                return obj == 'DAAF'
            });
            if (roles.length>0)
            {
              vm.permissionboutonValider = true;
            }

        });*/

        

        vm.showformfiltre = function()
        {
          //vm.showbuttonfiltre=!vm.showbuttonfiltre;
          vm.showfiltre=!vm.showfiltre;
        }
        vm.annulerfiltre = function()
        {
            vm.filtre = {};
        }
/*****************Debut StepOne convention_ufp_daaf_entete****************/

  //col table
        vm.convention_ufp_daaf_entete_column = [        
        {titre:"Numero vague"},        
        {titre:"Référence convention"},
        {titre:"Objet"},        
        {titre:"Référence financement"},
        {titre:"Montant à transferer"},
        {titre:"Frais bancaire"},        
        {titre:"Nombre bénéficiaire"},        
        {titre:"Montant convention"},        
        {titre:"Date création"},
        {titre:"Action"}];
        
        var annee = vm.date_now.getFullYear();
  //recuperation donnée programmation
        apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getconvention_creerinvalide_now","annee",annee).then(function(result)
        {
            vm.allconvention_ufp_daaf_entete = result.data.response;
        });

        vm.recherchefiltre = function(filtre)
        {   
            vm.affiche_load = true;
            var date_debut = convertionDate(filtre.date_debut);
            var date_fin = convertionDate(filtre.date_fin);

            apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index","menu","getconvention_creerinvalideByfiltre",'date_debut',
                                    date_debut,'date_fin',date_fin).then(function(result)
            {
                vm.allconvention_ufp_daaf_entete = result.data.response;
                console.log(vm.allconvention_ufp_daaf_entete);
                vm.affiche_load = false;
            });
        }

   //recuperation donnée programmation
        apiFactory.getAll("compte_daaf/index").then(function(result)
        {
            vm.allcompte_daaf = result.data.response;
            ////console.log(vm.allcompte_daaf);
        });

       

      //Masque de saisi ajout
        vm.ajouterConvention_ufp_daaf_entete = function ()
        { 
          var maxnum =1;
          if (NouvelItemConvention_ufp_daaf_entete == false)
          {

            apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_entete/index",'menu','conventionmaxBydate','date_today',convertionDate(new Date())).then(function(result)
              {
                 /***************************** Debut ref_convention auto********************/

                    var maxconventiontoday = result.data.response;
                    if (maxconventiontoday.length!=0)
                    {
                      maxnum =parseInt(maxconventiontoday[0].ref_convention.split('/')[2])+1;                    
                    }
                    var ref_auto = 'CO/'+vm.formatDate(new Date())+'/'+maxnum;

                  /***************************** Fin ref_convention auto********************/
                    
                    var items = {
                      $edit: true,
                      $selected: true,
                      id: '0',
                      ref_convention: ref_auto,
                      objet: 'transfert d’argent vers les deux cent (200) communautes',
                      ref_financement: 'Crédit IDA N° 62170',
                      montant_convention: 0,                            
                      montant_trans_comm: 0,
                      frais_bancaire: 0,
                      num_vague: '',
                      nbr_beneficiaire: 0,
                      date_creation: vm.date_now
                    };         
                    vm.allconvention_ufp_daaf_entete.push(items);
                    //$setTimeout(function() {console.log('ok')}, 5000);
                    
                    vm.allconvention_ufp_daaf_entete.forEach(function(conv)
                    {
                      if(conv.$selected==true)
                      {
                        vm.selectedItemConvention_ufp_daaf_entete = conv;
                      }
                    });

                    NouvelItemConvention_ufp_daaf_entete = true ;
              });
          }else
          {
            vm.showAlert('Ajout convention_ufp_daaf_entete','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation)
        {
            if (NouvelItemConvention_ufp_daaf_entete==false)
            {
                test_existanceConvention_ufp_daaf_entete (convention_ufp_daaf_entete,suppression,validation); 
            } 
            else
            {
                insert_in_baseConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation);
            }
        }

        //fonction de bouton d'annulation convention_ufp_daaf_entete
        vm.annulerConvention_ufp_daaf_entete = function(item)
        {
          if (NouvelItemConvention_ufp_daaf_entete == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.objet = currentItemConvention_ufp_daaf_entete.objet;            
            item.ref_convention = currentItemConvention_ufp_daaf_entete.ref_convention ;
            item.ref_financement = currentItemConvention_ufp_daaf_entete.ref_financement ;
            item.montant_convention = currentItemConvention_ufp_daaf_entete.montant_convention ; 
            item.montant_trans_comm = currentItemConvention_ufp_daaf_entete.montant_trans_comm ;
            item.frais_bancaire = currentItemConvention_ufp_daaf_entete.frais_bancaire ; 
            item.num_vague = currentItemConvention_ufp_daaf_entete.num_vague ;
            item.nbr_beneficiaire = currentItemConvention_ufp_daaf_entete.nbr_beneficiaire ;
            item.date_creation = currentItemConvention_ufp_daaf_entete.date_creation ;
          }
          else
          {
            vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
            {
                return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
            });
          }
          NouvelItemConvention_ufp_daaf_entete      = false;
          vm.selectedItemConvention_ufp_daaf_entete = {} ;
          
        };

        //fonction selection item region
        vm.selectionConvention_ufp_daaf_entete= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_entete = item;
            currentItemConvention_ufp_daaf_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_entete));
           // vm.allconvention_ufp_daaf_entete= [] ;
            
           if (vm.selectedItemConvention_ufp_daaf_entete.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_ufp_daaf_detail/index",'id_convention_ufp_daaf_entete',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_ufp_daaf_detail = result.data.response;
                  if (vm.allconvention_ufp_daaf_detail.length>0)
                  {
                    vm.showbuttonNouvDetail = false;
                  } 
                  ////console.log(result.data.response);                 
              });

              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_entete.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi_entete = result.data.response; 
                  //console.log(vm.allconvention_cisco_feffi_entete);                
              });
              vm.validation_item = item.validation; 
              vm.stepOne           = true;
              vm.stepTwo           = false;
              vm.stepThree         = false;
              
           }
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

        //fonction masque de saisie modification item convention_ufp_daaf_entete
        vm.modifierConvention_ufp_daaf_entete = function(item)
        {
            NouvelItemConvention_ufp_daaf_entete = false ;
            vm.selectedItemConvention_ufp_daaf_entete = item;
            currentItemConvention_ufp_daaf_entete = angular.copy(vm.selectedItemItemConvention_ufp_daaf_entete);
            $scope.vm.allconvention_ufp_daaf_entete.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.objet = vm.selectedItemConvention_ufp_daaf_entete.objet ;            
            item.ref_convention = vm.selectedItemConvention_ufp_daaf_entete.ref_convention ;
            item.ref_financement = vm.selectedItemConvention_ufp_daaf_entete.ref_financement ;
            item.montant_convention = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_convention) ; 
            item.montant_trans_comm = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) ;
            item.frais_bancaire = parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire) ;
            item.num_vague = parseInt(vm.selectedItemConvention_ufp_daaf_entete.num_vague) ;
            item.nbr_beneficiaire = parseInt(vm.selectedItemConvention_ufp_daaf_entete.nbr_beneficiaire) ;
            item.date_creation = vm.selectedItemConvention_ufp_daaf_entete.date_creation ;
        };

        //fonction bouton suppression item convention_ufp_daaf_entete
        vm.supprimerConvention_ufp_daaf_entete = function()
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
                vm.ajoutConvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_ufp_daaf_entete
        function test_existanceConvention_ufp_daaf_entete (item,suppression,validation)
        {          
            if (suppression!=1)
            {
               var conv = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                {
                   return obj.id == currentItemConvention_ufp_daaf_entete.id;
                });
                if(conv[0])
                {
                   if((conv[0].objet!=currentItemConvention_ufp_daaf_entete.objet)
                    || (conv[0].ref_convention!=currentItemConvention_ufp_daaf_entete.ref_convention)
                    || (conv[0].montant_convention!=currentItemConvention_ufp_daaf_entete.montant_convention)
                    || (conv[0].ref_financement!=currentItemConvention_ufp_daaf_entete.ref_financement)
                    || (conv[0].montant_trans_comm!=currentItemConvention_ufp_daaf_entete.montant_trans_comm)
                    || (conv[0].frais_bancaire!=currentItemConvention_ufp_daaf_entete.frais_bancaire)
                    || (conv[0].num_vague!=currentItemConvention_ufp_daaf_entete.num_vague)
                    || (conv[0].nbr_beneficiaire!=currentItemConvention_ufp_daaf_entete.nbr_beneficiaire))                    
                      { 
                        insert_in_baseConvention_ufp_daaf_entete(item,suppression,validation);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseConvention_ufp_daaf_entete(item,suppression,validation);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function insert_in_baseConvention_ufp_daaf_entete(convention_ufp_daaf_entete,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_ufp_daaf_entete==false)
            {
                getId = vm.selectedItemConvention_ufp_daaf_entete.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    objet:   convention_ufp_daaf_entete.objet,
                    ref_convention: convention_ufp_daaf_entete.ref_convention,
                    montant_convention: convention_ufp_daaf_entete.montant_convention,
                    ref_financement: convention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: convention_ufp_daaf_entete.montant_trans_comm,
                    frais_bancaire: convention_ufp_daaf_entete.frais_bancaire,
                    num_vague: convention_ufp_daaf_entete.num_vague,
                    nbr_beneficiaire: convention_ufp_daaf_entete.nbr_beneficiaire,
                    validation: validation               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {
               
                if (NouvelItemConvention_ufp_daaf_entete == false)
                {
                    // Upref_financement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_ufp_daaf_entete.$selected = false;
                        vm.selectedItemConvention_ufp_daaf_entete.$edit     = false;
                        vm.selectedItemConvention_ufp_daaf_entete ={};
                    }
                    else 
                    {    
                      vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
                      });
                      
                    }
                }
                else
                {
                  convention_ufp_daaf_entete.id = String(data.response);              
                  NouvelItemConvention_ufp_daaf_entete = false;

            }
            vm.validation_item = validation;
              convention_ufp_daaf_entete.$selected = false;
              convention_ufp_daaf_entete.$edit = false;
              vm.selectedItemConvention_ufp_daaf_entete = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }
        vm.changefraisbancaire = function(item)
        {
          item.montant_convention = parseInt(item.montant_trans_comm) + parseInt(item.frais_bancaire);
        }
        vm.validerConvention = function()
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            }; 
            
            var datas = $.param({
                    supprimer: 0,
                    id:        vm.selectedItemConvention_ufp_daaf_entete.id,
                    objet:   vm.selectedItemConvention_ufp_daaf_entete.objet,
                    ref_convention: vm.selectedItemConvention_ufp_daaf_entete.ref_convention,
                    montant_convention: vm.selectedItemConvention_ufp_daaf_entete.montant_convention,
                    ref_financement: vm.selectedItemConvention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm,
                    frais_bancaire: vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire,
                    num_vague: vm.selectedItemConvention_ufp_daaf_entete.num_vague,
                    nbr_beneficiaire: vm.selectedItemConvention_ufp_daaf_entete.nbr_beneficiaire,
                    validation: 1               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {   
              vm.allconvention_ufp_daaf_entete = vm.allconvention_ufp_daaf_entete.filter(function(obj)
              {
                  return obj.id !== vm.selectedItemConvention_ufp_daaf_entete.id;
              });
              vm.afficherboutonValider = false;
              vm.validation_item = 1;
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de validation de donnée');});
        }

        vm.changevague = function(item)
        {
          var objet= 'Transfert d’argent vers les deux cent (200) communautés de la première vague';
          if (item.num_vague==2)
          {
            objet= 'Transfert d’argent vers les deux cent (200) communautés de la deuxième vague';
          }
          item.objet= objet;
        }
        vm.affichevague = function(num_vague)
        {
          var affiche = 'Première vague';
          if (num_vague==2)
          {
            affiche= 'Deuxième vague';
          }
          return affiche;
        }

  /*****************Fin StepOne convention_ufp_daaf_entete****************/

  /*****************Debut StepOne convention_ufp_daaf_detail****************/

  //col table
        vm.convention_ufp_daaf_detail_column = [        
        {titre:"Nom banque"},
        {titre:"Adresse banque"},        
        {titre:"compte"},
        {titre:"Delai"},
        {titre:"Date signature"},        
        {titre:"Observation"},
        {titre:"Action"}];

  //recuperation donnée programmation
        apiFactory.getAll("convention_ufp_daaf_detail/index").then(function(result)
        {
            vm.allconvention_ufp_daaf_detail = result.data.response;
        });

      //Masque de saisi ajout
        vm.ajouterConvention_ufp_daaf_detail = function ()
        { 
          if (NouvelItemConvention_ufp_daaf_detail == false)
          {
            var items = {
              $edit: true,
              $selected: true,
              id: '0',
              id_compte_daaf:'',
              agence:'',
              compte:'',
              delai:'',
              date_signature:'',
              observation:''
            };         
            vm.allconvention_ufp_daaf_detail.push(items);
            vm.allconvention_ufp_daaf_detail.forEach(function(conv)
            {
              if(conv.$selected==true)
              {
                vm.selectedItemConvention_ufp_daaf_detail = conv;
              }
            });

            NouvelItemConvention_ufp_daaf_detail = true ;
          }else
          {
            vm.showAlert('Ajout convention_ufp_daaf_detail','Un formulaire d\'ajout est déjà ouvert!!!');
          }                
                      
        };

        //fonction ajout dans bdd
        function ajoutConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation)
        {
            if (NouvelItemConvention_ufp_daaf_detail==false)
            {
                test_existanceConvention_ufp_daaf_detail (convention_ufp_daaf_detail,suppression,validation); 
            } 
            else
            {
                insert_in_baseConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation);
            }
        }

        //fonction de bouton d'annulation convention_ufp_daaf_detail
        vm.annulerConvention_ufp_daaf_detail = function(item)
        {
          if (NouvelItemConvention_ufp_daaf_detail == false)
          {
            item.$edit = false;
            item.$selected = false;

            item.id_compte_daaf  = currentItemConvention_ufp_daaf_detail.compte_daaf.id ;
            item.agence  = currentItemConvention_ufp_daaf_detail.compte_daaf.agence ;
            item.compte  = currentItemConvention_ufp_daaf_detail.compte_daaf.compte ;
            item.delai = currentItemConvention_ufp_daaf_detail.delai ;
            item.observation  = currentItemConvention_ufp_daaf_detail.observation ;
            item.date_signature  = new Date(currentItemConvention_ufp_daaf_detail.date_signature) ;  
          }
          else
          {
            vm.allconvention_ufp_daaf_detail = vm.allconvention_ufp_daaf_detail.filter(function(obj)
            {
                return obj.id !== vm.selectedItemConvention_ufp_daaf_detail.id;
            });
          }
          NouvelItemConvention_ufp_daaf_detail      = false;
          vm.selectedItemConvention_ufp_daaf_detail = {} ;
          
        };

        //fonction selection item region
        vm.selectionConvention_ufp_daaf_detail= function (item)
        {
            vm.selectedItemConvention_ufp_daaf_detail = item;
            if (item.$selected==false)
            {
              currentItemConvention_ufp_daaf_detail     = JSON.parse(JSON.stringify(vm.selectedItemConvention_ufp_daaf_detail));
           
            }
            
            vm.stepTwo = false;
            vm.stepThree = false;
           if (vm.selectedItemConvention_ufp_daaf_detail.id!=0)
           {
              //recuperation donnée convention
              apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'id_convention_ufpdaaf',vm.selectedItemConvention_ufp_daaf_detail.id).then(function(result)
              {
                  vm.allconvention_cisco_feffi = result.data.response;                  
              });
           }
        };
        $scope.$watch('vm.selectedItemConvention_ufp_daaf_detail', function()
        {
            if (!vm.allconvention_ufp_daaf_detail) return;
            vm.allconvention_ufp_daaf_detail.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemConvention_ufp_daaf_detail.$selected = true;
        });

        //fonction masque de saisie modification item convention_ufp_daaf_detail
        vm.modifierConvention_ufp_daaf_detail = function(item)
        {
            NouvelItemConvention_ufp_daaf_detail = false ;
            vm.selectedItemConvention_ufp_daaf_detail = item;
            currentItemConvention_ufp_daaf_detail = angular.copy(vm.selectedItemConvention_ufp_daaf_detail);
            $scope.vm.allconvention_ufp_daaf_detail.forEach(function(cis) {
              cis.$edit = false;
            });

            item.$edit = true;
            item.$selected = true;

            item.id_compte_daaf  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.id ;
            item.agence  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.agence ;
            item.compte  = vm.selectedItemConvention_ufp_daaf_detail.compte_daaf.compte ;
            item.delai = parseInt(vm.selectedItemConvention_ufp_daaf_detail.delai) ;
            item.observation  = vm.selectedItemConvention_ufp_daaf_detail.observation ;
            item.date_signature  = new Date(vm.selectedItemConvention_ufp_daaf_detail.date_signature) 
        };

        //fonction bouton suppression item convention_ufp_daaf_detail
        vm.supprimerConvention_ufp_daaf_detail = function()
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
                vm.ajoutConvention_ufp_daaf_detail(vm.selectedItemConvention_ufp_daaf_detail,1);
              }, function() {
                //alert('rien');
              });
        };

        //function teste s'il existe une modification item convention_ufp_daaf_detail
        function test_existanceConvention_ufp_daaf_detail (item,suppression,validation)
        {   //console.log(currentItemConvention_ufp_daaf_detail);       
            if (suppression!=1)
            {
               var convD = vm.allconvention_ufp_daaf_detail.filter(function(obj)
                {
                   return obj.id == currentItemConvention_ufp_daaf_detail.id;
                });
                if(convD[0])
                {
                   if( (convD[0].intitule!=currentItemConvention_ufp_daaf_detail.intitule)
                    || (convD[0].date_signature!=currentItemConvention_ufp_daaf_detail.date_signature)
                    || (convD[0].id_compte_daaf!=currentItemConvention_ufp_daaf_detail.id_compte_daaf)
                    || (convD[0].observation!=currentItemConvention_ufp_daaf_detail.observation)
                    || (convD[0].delai!=currentItemConvention_ufp_daaf_detail.delai))                    
                      { 
                        insert_in_baseConvention_ufp_daaf_detail(item,suppression,validation);
                      }
                      else
                      {  
                        item.$selected = true;
                        item.$edit = false;
                      }
                }
            } else
                  insert_in_baseConvention_ufp_daaf_detail(item,suppression,validation);
        }

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_detail
        function insert_in_baseConvention_ufp_daaf_detail(convention_ufp_daaf_detail,suppression,validation)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var getId = 0;
            if (NouvelItemConvention_ufp_daaf_detail==false)
            {
                getId = vm.selectedItemConvention_ufp_daaf_detail.id; 
            } 
            
            var datas = $.param({
                    supprimer: suppression,
                    id:        getId,
                    delai:    convention_ufp_daaf_detail.delai,
                    date_signature:    convertionDate(new Date(convention_ufp_daaf_detail.date_signature)),
                    id_compte_daaf: convention_ufp_daaf_detail.id_compte_daaf,
                    observation: convention_ufp_daaf_detail.observation,
                    id_convention_ufp_daaf_entete: vm.selectedItemConvention_ufp_daaf_entete.id               
                });

            //console.log(datas);
                //factory
            apiFactory.add("convention_ufp_daaf_detail/index",datas, config).success(function (data)
            {
               var compte = vm.allcompte_daaf.filter(function(obj)
                {
                   return obj.id == convention_ufp_daaf_detail.id_compte_daaf;
                });
                if (NouvelItemConvention_ufp_daaf_detail == false)
                {
                    // Upref_financement or delete: id exclu                 
                    if(suppression==0)
                    {
                        vm.selectedItemConvention_ufp_daaf_detail.compte_daaf = compte[0];
                        vm.selectedItemConvention_ufp_daaf_detail.$selected = false;
                        vm.selectedItemConvention_ufp_daaf_detail.$edit     = false;
                        vm.selectedItemConvention_ufp_daaf_detail ={};
                    }
                    else 
                    {    
                      vm.allconvention_ufp_daaf_detail = vm.allconvention_ufp_daaf_detail.filter(function(obj)
                      {
                          return obj.id !== vm.selectedItemConvention_ufp_daaf_detail.id;
                      });
                      vm.showbuttonNouvDetail = true;
                    }
                }
                else
                {
                  convention_ufp_daaf_detail.compte_daaf = compte[0];
                  convention_ufp_daaf_detail.id = String(data.response);              
                  NouvelItemConvention_ufp_daaf_detail = false;
                  vm.showbuttonNouvDetail = false;
            }
              convention_ufp_daaf_detail.$selected = false;
              convention_ufp_daaf_detail.$edit = false;
              vm.selectedItemConvention_ufp_daaf_detail = {};
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }

        vm.changecompte_daaf = function(item)
        { var compte = vm.allcompte_daaf.filter(function(obj)
          {
            return obj.id == item.id_compte_daaf;
          });
          item.agence = compte[0].agence;
          item.compte = compte[0].compte;
        }

  /*****************Fin StepOne convention_ufp_daaf_detail****************/


  /*****************Debut StepTwo convention***************/

        //col table
        vm.convention_cisco_feffi_entete_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Site"
        },
       {titre:"Accés"
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
        },
        {titre:"Action"
        }];
        
        

        //fonction selection item convetion
        vm.selectionConvention_cisco_feffi_entete = function (item)
        {
            vm.selectedItemConvention_cisco_feffi_entete = item;
            currentItemConvention_cisco_feffi_entete     = JSON.parse(JSON.stringify(vm.selectedItemConvention_cisco_feffi_entete));           
           vm.stepOne = true;
        };
        $scope.$watch('vm.selectedItemConvention_cisco_feffi_entete', function()
        {
             if (!vm.allconvention_cisco_feffi_entete) return;
             vm.allconvention_cisco_feffi_entete.forEach(function(item)
             {
                item.$selected = false;
             });
             vm.selectedItemConvention_cisco_feffi_entete.$selected = true;

        });

        //fonction bouton suppression de l'item convention_cisco_feefi
        vm.supprimerConvention_cisco_feffi_entete = function()
        {
            var confirm = $mdDialog.confirm()
                    .title("Etes-vous sûr d'enlever cet enregistrement ?")
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
              $mdDialog.show(confirm).then(function() {
                insert_in_base_convention_cisco_feffi_entete(vm.selectedItemConvention_cisco_feffi_entete,0,1);
                
        var NouvelItemConvention_cisco_feffi_entete = false;
              }, function() {
                //alert('rien');
              });
        };

        vm.ajoutConventionDialog = function (ev)
        {
          NouvelItemConvention_cisco_feffi_entete = true;
          var confirm = $mdDialog.confirm({
          controller: ConventionDialogController,
          templateUrl: 'app/main/paeb/gerer_subvention_operation/niveau_ufp_daaf/convention_ufp_daaf/conventiondialog.html',
          parent: angular.element(document.body),
          targetEvent: ev, 
          
          })

              $mdDialog.show(confirm).then(function(data)
              { var nbr= data.length;
                var iterator = 0;
                var sum_montant=0;
                console.log(nbr);
               data.forEach(function(item,index)
               {
                  insert_in_base_convention_cisco_feffi_entete(item,'0',0);
                  vm.allconvention_cisco_feffi_entete.push(item);
                  sum_montant += item.montant_total;
                  if (index== nbr-1)
                  {
                    var montant_trans = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) + parseInt(sum_montant);
                    var montant_conv = montant_trans + parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire);
                    console.log(sum_montant);
                    miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,montant_trans,montant_conv);
                  }
                  
                 //console.log(sum_montant);
                 
               });
               

               //recuperation donnée convention detail
               /* apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_detail/index",'id_convention_entete',data.id).then(function(result)
                {
                    var convention_cife_detail_entete = result.data.response;
                    ////console.log(convention_cife_detail[0]);
                   // var montant = parseInt(vm.selectedItemConvention_ufp_daaf_entete.ref_convention) + parseInt(convention_cife_detail_entete[0].montant_total);
                    //miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,'0',montant);
                });*/
             
              }, function(){//alert('rien');
            });

        }

        //insertion ou mise a jours ou suppression item dans bdd convention_cisco_feffi
        function insert_in_base_convention_cisco_feffi_entete(convention_cisco_feffi_entete,suppression,enlever)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            console.log(convention_cisco_feffi_entete);
            //var validation = 1;
            var datas = $.param({
                    supprimer: suppression,
                    id:        convention_cisco_feffi_entete.id,
                    id_cisco: convention_cisco_feffi_entete.cisco.id,
                    id_feffi: convention_cisco_feffi_entete.feffi.id,
                    id_site: convention_cisco_feffi_entete.site.id,
                    type_convention:    convention_cisco_feffi_entete.type_convention,
                    objet:    convention_cisco_feffi_entete.objet,
                    ref_financement:  convention_cisco_feffi_entete.ref_financement,
                    ref_convention:   convention_cisco_feffi_entete.ref_convention,
                    montant_total:    convention_cisco_feffi_entete.montant_total,
                    //avancement:    convention_cisco_feffi_entete.avancement,
                    id_user:    convention_cisco_feffi_entete.user.id,
                    id_convention_ufpdaaf : vm.selectedItemConvention_ufp_daaf_entete.id,
                    validation: 2               
                });

            if (enlever==1)
            {
                datas = $.param({
                    supprimer: suppression,
                    id:        convention_cisco_feffi_entete.id,
                    id_cisco: convention_cisco_feffi_entete.cisco.id,
                    id_feffi: convention_cisco_feffi_entete.feffi.id,
                    id_site: convention_cisco_feffi_entete.site.id,
                    type_convention:    convention_cisco_feffi_entete.type_convention,
                    objet:    convention_cisco_feffi_entete.objet,
                    ref_financement:  convention_cisco_feffi_entete.ref_financement,
                    ref_convention:   convention_cisco_feffi_entete.ref_convention,
                    montant_total:    convention_cisco_feffi_entete.montant_total,
                    //avancement:    convention_cisco_feffi_entete.avancement,
                    id_user:    convention_cisco_feffi_entete.user.id,
                    validation: 1              
                });
            }
            
            console.log(datas);
                //factory
            apiFactory.add("convention_cisco_feffi_entete/index",datas, config).success(function (data)
            {   

              if (NouvelItemConvention_cisco_feffi_entete== false)
                { 
                  vm.allconvention_cisco_feffi_entete = vm.allconvention_cisco_feffi_entete.filter(function(obj)
                  {
                      return obj.id !== vm.selectedItemConvention_cisco_feffi_entete.id;
                  });
                  var montant_trans = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) - parseInt(convention_cisco_feffi_entete.montant_total);
                  var montant_conv = montant_trans + parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire)
                  miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,montant_trans,montant_conv);
                  console.log(vm.allconvention_cisco_feffi_entete);
                }
                /*else
                {
                  //vm.allconvention_cisco_feffi_entete.push.apply(convention_cisco_feffi_entete);
                  NouvelItemConvention_cisco_feffi_entete= false;
                  var montant_trans = parseInt(vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm) + parseInt(convention_cisco_feffi_entete.montant_total);
                  var montant_conv = montant_trans + parseInt(vm.selectedItemConvention_ufp_daaf_entete.frais_bancaire)
                  miseajourconvention_ufp_daaf_entete(vm.selectedItemConvention_ufp_daaf_entete,montant_trans,montant_conv);
                    
                }*/
                
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        } 

        //insertion ou mise a jours ou suppression item dans bdd convention_ufp_daaf_entete
        function miseajourconvention_ufp_daaf_entete(convention_ufp_daaf_entete,montant_trans, montant_conv)
        {
            //add
            var config =
            {
                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
            };
            
            var datas = $.param({
                    supprimer: '0',
                    id:      convention_ufp_daaf_entete.id,
                    objet:   convention_ufp_daaf_entete.objet,
                    ref_convention: convention_ufp_daaf_entete.ref_convention,
                    montant_convention: montant_conv,
                    ref_financement: convention_ufp_daaf_entete.ref_financement,
                    montant_trans_comm: montant_trans,
                    frais_bancaire: convention_ufp_daaf_entete.frais_bancaire,
                    num_vague: convention_ufp_daaf_entete.num_vague,
                    nbr_beneficiaire: convention_ufp_daaf_entete.nbr_beneficiaire,
                    validation: 0               
                });
                //factory
            apiFactory.add("convention_ufp_daaf_entete/index",datas, config).success(function (data)
            {
               
                vm.selectedItemConvention_ufp_daaf_entete.montant_trans_comm = montant_trans;  
                vm.selectedItemConvention_ufp_daaf_entete.montant_convention = montant_conv;            
            
          }).error(function (data){vm.showAlert('Error','Erreur lors de l\'insertion de donnée');});

        }             

  /*****************Fin StepTwo convention****************/        

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
        vm.getAnneeDate = function (daty)
        {
          if (daty) 
          {   
            var date  = new Date(daty);
              var annee = date.getFullYear();
              return annee;
          }            

        }
        vm.affichage_type_convention = function(type_convention)
        { 
          var affichage = 'Initial';
          if(type_convention == 0)
          {
            affichage = 'Autre';
          }
          return affichage;
        }
    }
    


/*****************Debut ConventionDialogue Controlleur  ****************/    
    function ConventionDialogController($mdDialog, $scope, apiFactory, $state)
    { 
        var dg=$scope;
        dg.affichebuttonAjouter = false;
        dg.selectedItemConventionDialog = {};
        var currentItemConventionDialog;
        var nouvelItemConventionDialog = false;
        dg.allconventionDialog = [];
        var convention_a_anvoyer= [];

        dg.conventiondialog_column = [
        {titre:"CISCO"
        },
        {titre:"FEFFI"
        },
        {titre:"Code sous projet site"
        },
        {titre:"Accés site"
        },
        {titre:"Référence convention"
        },
        {titre:"Objet"
        },
        {titre:"Référence Financement"
        },
        {titre:"Cout éstimé"
        },
        /*{titre:"Avancement"
        },*/
        {titre:"Utilisateur"
        },
        {titre:"Attachée"
        }];

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };

        apiFactory.getAPIgeneraliserREST("convention_cisco_feffi_entete/index",'menu','getconventionvalidedaaf').then(function(result)
        {dg.allconventionDialog = result.data.response;
console.log(dg.allconventionDialog);
        });

        dg.cancel = function()
        {
          $mdDialog.cancel();
          dg.affichebuttonAjouter = false;
        };

        dg.dialognouveauajout = function(conven)
        {  
            $mdDialog.hide(convention_a_anvoyer);
            dg.affichebuttonAjouter = false;
        }

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

        //fonction selection item convetion
        /*dg.selectionConventionDialog = function (item)
        {
            dg.selectedItemConventionDialog  = item;
            dg.affichebuttonAjouter = true;               
        };
        
       $scope.$watch('selectedItemConventionDialog', function()
        {
            if (!dg.allconventionDialog) return;
              dg.allconventionDialog.forEach(function(iteme)
              {
                  iteme.$selected = false;
              });
            dg.selectedItemConventionDialog.$selected = true;
        });*/
        dg.affichage_type_convention = function(type_convention)
        { 
          var affichage = 'Initial';
          if(type_convention == 0)
          {
            affichage = 'Autre';
          }
          return affichage;
        }
        dg.changecheckbox = function(convention)
        {
          switch (convention.envoi)
            {
              case true:
                   convention_a_anvoyer.push(convention);                     
                  break;

             case false:
                  convention_a_anvoyer = convention_a_anvoyer.filter(function(obj)
                  {
                      return obj.id !== convention.id;
                  });
                   
                  break;
              default:
                  break;
            }

          console.log(convention_a_anvoyer);
          
          //console.log(convention.envoi);
        }

    }

/*****************Fin ConventionDialogue Controlleur  ****************/ 

})();
