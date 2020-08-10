(function ()
{
    'use strict';

    angular
        .module('app.paeb.ddb.piece_justificatif_prevu', [
            'app.paeb.ddb.piece_justificatif_prevu.piece_justificatif_daaf_prevu',
            'app.paeb.ddb.piece_justificatif_prevu.piece_justificatif_feffi_prevu'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('paeb.administration.donneesdebases.piece_justificatif_prevu', {
            title : 'Pièce justificative prévue',
            icon  : 'icon-clipboard-text',
            weight: 14
        });
    }

})();
