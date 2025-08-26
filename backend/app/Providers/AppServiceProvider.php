<?php

namespace App\Providers;

use Doctrine\SqlFormatter\NullHighlighter;
use Doctrine\SqlFormatter\SqlFormatter;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Output\OutputInterface;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        DB::listen(function (QueryExecuted $query) {
            $sql = (new SqlFormatter(new NullHighlighter()))->format($query->toRawSql(), "    ");
            $keywords = [
                'select','from','where','join','inner join','left join','right join',
                'group by','order by','having','limit','offset','and','or','on','as'
            ];
            $pattern = '/\b(' . implode('|', array_map('preg_quote', $keywords)) . ')\b/i';
            $sql = preg_replace_callback($pattern, fn($m) => strtoupper($m[1]), $sql);

            $output = new ConsoleOutput(OutputInterface::VERBOSITY_VERBOSE, true);
            foreach (explode("\n", $sql) as $line) {
                $output->writeln("<comment>{$line}</comment>");
            }
            $output->writeln("<comment>".sprintf('(%.2f ms)', $query->time ?? 0)."</comment>");
        });
    }
}
