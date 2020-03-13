(function ()
{
    'use strict';

    var tab = [
            
            'app.paeb.ddb.localisation',
            'app.paeb.ddb.acces_zone',
            'app.paeb.ddb.cisco',
            'app.paeb.ddb.ecole',
            //'app.paeb.ddb.plan_comptable',
            'app.paeb.ddb.prestataire',
            'app.paeb.ddb.bureau_etude',
            'app.paeb.ddb.type_batiment',
            'app.paeb.ddb.zone_subvention',
            'app.paeb.ddb.infrastructure',
            'app.paeb.ddb.type_cout_divers',
            'app.paeb.ddb.type_mobilier',
            'app.paeb.ddb.type_latrine',
            'app.paeb.ddb.tranche_demande_mpe',
            'app.paeb.ddb.tranche_deblocage_feffi',
            'app.paeb.ddb.tranche_demande_latrine_mpe',
            'app.paeb.ddb.tranche_demande_latrine_moe',
            'app.paeb.ddb.tranche_demande_latrine_pr',
            'app.paeb.ddb.tranche_demande_mobilier_mpe',
            'app.paeb.ddb.tranche_demande_mobilier_moe',
            'app.paeb.ddb.tranche_demande_mobilier_pr',
            'app.paeb.ddb.tranche_deblocage_daaf',
            'app.paeb.ddb.tranche_demande_batiment_moe',
            'app.paeb.ddb.tranche_demande_batiment_pr',
            'app.paeb.ddb.tranche_d_debut_travaux_moe',
            'app.paeb.ddb.tranche_d_debut_travaux_pr',
            'app.paeb.ddb.tranche_d_fin_travaux_moe',
            'app.paeb.ddb.tranche_d_fin_travaux_pr',
            'app.paeb.ddb.partenaire_relai',
            'app.paeb.ddb.classification_site',
            'app.paeb.ddb.situation_participant_dpp',
            'app.paeb.ddb.situation_participant_emies',
            'app.paeb.ddb.situation_participant_gfpc',
            'app.paeb.ddb.situation_participant_pmc',
            'app.paeb.ddb.situation_participant_sep',
            'app.paeb.ddb.document_moe',
            'app.paeb.ddb.document_prestataire',
            'app.paeb.ddb.document_pr',
            'app.paeb.ddb.document_feffi'

            ] ;

    angular
        .module('app.paeb.ddb', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        /*msNavigationServiceProvider.saveItem('paeb.ddb', {
            title : 'Données de Bases',
            icon  : 'icon-data',
            weight: 2,
            hidden: function()
            {
                    return vs;
            }
        });*/



    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions = ["DDB"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
